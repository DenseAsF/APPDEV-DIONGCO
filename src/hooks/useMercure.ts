import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  subscribeToMercure,
  MercureSubscription,
  MercureEventCallback,
  MercureTopics,
  decodeJwtPayload,
} from '../services/mercure';
import { useNotifications } from '../context/NotificationContext';
import { AppNotification, NotificationStatus } from '../context/NotificationContext';

/**
 * Hook to subscribe to Mercure topics.
 * Automatically manages the EventSource connection lifecycle.
 * Reconnects when the app comes back to foreground.
 */
export function useMercure(
  topics: string[],
  onMessage: MercureEventCallback,
  enabled: boolean = true,
) {
  const subscriptionRef = useRef<MercureSubscription | null>(null);
  const onMessageRef = useRef<MercureEventCallback>(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.close();
      subscriptionRef.current = null;
    }

    if (!enabled || topics.length === 0) {
      return;
    }

    subscriptionRef.current = subscribeToMercure(
      topics,
      (data) => onMessageRef.current(data),
      (error) => {
        console.warn('[useMercure] Connection error, will auto-reconnect:', error);
      },
    );
  }, [topics.join(','), enabled]);

  useEffect(() => {
    connect();
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.close();
        subscriptionRef.current = null;
      }
    };
  }, [connect]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && enabled) {
        console.log('[useMercure] App became active, reconnecting...');
        connect();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (subscriptionRef.current) {
          subscriptionRef.current.close();
          subscriptionRef.current = null;
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [connect, enabled]);
}

// ---------------------------------------------------------------------------
// Notification helper — maps a booking status to a title + message
// ---------------------------------------------------------------------------
const buildNotification = (
  status: string,
  bookingId: string | number,
): { title: string; message: string; status: NotificationStatus } | null => {
  switch (status) {
    case 'Booked':
      return {
        title: 'Booking Confirmed ✓',
        message: `Your booking #${bookingId} has been confirmed.`,
        status: 'booked',
      };
    case 'Checked In':
      return {
        title: 'Checked In 🏨',
        message: `Welcome! You have checked in for booking #${bookingId}.`,
        status: 'checked_in',
      };
    case 'Checked Out':
      return {
        title: 'Checked Out',
        message: `Thanks for your stay! Booking #${bookingId} is complete.`,
        status: 'checked_out',
      };
    case 'Cancelled':
      return {
        title: 'Booking Cancelled',
        message: `Your booking #${bookingId} has been cancelled.`,
        status: 'cancelled',
      };
    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
// Helper: fires the in-app notification if the Mercure payload has a status
// ---------------------------------------------------------------------------
const handleNotification = (
  _data: any,
  _addNotification: (n: any) => void,
) => {
  // Notifications are handled globally by GlobalMercureListener in index.tsx
  // to avoid duplicates. Do not fire notifications here.
};

/**
 * Hook to subscribe to the current user's booking updates via Mercure.
 * Automatically resolves the user's username from the stored JWT.
 */
export function useMercureBookings(onBookingUpdate: MercureEventCallback) {
  const { addNotification } = useNotifications();
  const topicsRef = useRef<string[]>([]);
  const subscriptionRef = useRef<MercureSubscription | null>(null);
  const onUpdateRef = useRef<MercureEventCallback>(onBookingUpdate);
  const addNotificationRef = useRef(addNotification);

  useEffect(() => {
    onUpdateRef.current = onBookingUpdate;
  }, [onBookingUpdate]);

  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token || cancelled) return;

        const payload = decodeJwtPayload(token);
        console.log('[useMercureBookings] JWT payload keys:', payload ? Object.keys(payload) : 'null');
        console.log('[useMercureBookings] JWT payload:', JSON.stringify(payload));
        const username = payload?.username || payload?.sub;

        if (!username || cancelled) {
          console.warn('[useMercureBookings] Could not determine username from token. Full payload:', JSON.stringify(payload));
          return;
        }
        console.log('[useMercureBookings] Resolved username for topic:', username);

        const topic = MercureTopics.userBookings(username);
        topicsRef.current = [topic];
        console.log('[useMercureBookings] Subscribing to:', topic);

        subscriptionRef.current = subscribeToMercure(
          [topic],
          // onMessage — forward to caller AND fire in-app notification
          (data) => {
            onUpdateRef.current(data);
            handleNotification(data, addNotificationRef.current);
          },
          // onError — 3rd and final argument
          (error) => {
            console.warn('[useMercureBookings] Error:', error);
          },
        );
      } catch (e) {
        console.error('[useMercureBookings] Setup error:', e);
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (subscriptionRef.current) {
        subscriptionRef.current.close();
        subscriptionRef.current = null;
      }
    };
  }, []);

  // Reconnect when app comes back to foreground
  useEffect(() => {
    const handleAppState = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && topicsRef.current.length > 0) {
        if (subscriptionRef.current) {
          subscriptionRef.current.close();
        }
        subscriptionRef.current = subscribeToMercure(
          topicsRef.current,
          // onMessage
          (data) => {
            onUpdateRef.current(data);
            handleNotification(data, addNotificationRef.current);
          },
          // onError
          (error) => {
            console.warn('[useMercureBookings] Reconnect error:', error);
          },
        );
      } else if (nextAppState !== 'active') {
        if (subscriptionRef.current) {
          subscriptionRef.current.close();
          subscriptionRef.current = null;
        }
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, []);
}

/**
 * Hook to subscribe to room availability updates via Mercure.
 */
export function useMercureRooms(onRoomUpdate: MercureEventCallback) {
  useMercure([MercureTopics.rooms()], onRoomUpdate);
}