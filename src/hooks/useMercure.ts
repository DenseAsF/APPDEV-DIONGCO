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

/**
 * Hook to subscribe to Mercure topics.
 * Automatically manages the EventSource connection lifecycle.
 * Reconnects when the app comes back to foreground.
 *
 * @param topics - Array of topic URIs to subscribe to
 * @param onMessage - Callback when a message is received
 * @param enabled - Whether the subscription should be active (default: true)
 */
export function useMercure(
  topics: string[],
  onMessage: MercureEventCallback,
  enabled: boolean = true,
) {
  const subscriptionRef = useRef<MercureSubscription | null>(null);
  const onMessageRef = useRef<MercureEventCallback>(onMessage);

  // Keep callback ref up to date without re-subscribing
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    // Close existing subscription
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

  // Subscribe/unsubscribe on mount/unmount or when topics change
  useEffect(() => {
    connect();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.close();
        subscriptionRef.current = null;
      }
    };
  }, [connect]);

  // Reconnect when app comes back to foreground
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

/**
 * Hook to subscribe to the current user's booking updates via Mercure.
 * Automatically resolves the user's username from the stored JWT.
 *
 * @param onBookingUpdate - Callback when a booking update is received
 */
export function useMercureBookings(onBookingUpdate: MercureEventCallback) {
  const topicsRef = useRef<string[]>([]);
  const subscriptionRef = useRef<MercureSubscription | null>(null);
  const onUpdateRef = useRef<MercureEventCallback>(onBookingUpdate);

  useEffect(() => {
    onUpdateRef.current = onBookingUpdate;
  }, [onBookingUpdate]);

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
          (data) => onUpdateRef.current(data),
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

  // Reconnect on app foreground
  useEffect(() => {
    const handleAppState = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && topicsRef.current.length > 0) {
        // Reconnect
        if (subscriptionRef.current) {
          subscriptionRef.current.close();
        }
        subscriptionRef.current = subscribeToMercure(
          topicsRef.current,
          (data) => onUpdateRef.current(data),
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
 *
 * @param onRoomUpdate - Callback when a room update is received
 */
export function useMercureRooms(onRoomUpdate: MercureEventCallback) {
  useMercure([MercureTopics.rooms()], onRoomUpdate);
}
