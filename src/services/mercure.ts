import EventSource from 'react-native-sse';
import { getMercureHubUrl } from '../config';

export type MercureEventCallback = (data: any) => void;

export interface MercureSubscription {
  close: () => void;
  topics: string[];
}

/**
 * Subscribe to one or more Mercure topics using Server-Sent Events (SSE).
 * Mercure uses public topics so no auth is needed on the subscriber side.
 *
 * @param topics - Array of topic URIs to subscribe to
 * @param onMessage - Callback fired when a message is received
 * @param onError - Optional error callback
 * @returns MercureSubscription with a close() method to unsubscribe
 */
export function subscribeToMercure(
  topics: string[],
  onMessage: MercureEventCallback,
  onError?: (error: any) => void,
): MercureSubscription {
  const hubUrl = getMercureHubUrl();

  // Build the subscription URL manually to avoid URL normalization adding a trailing slash
  const queryString = topics
    .map(topic => 'topic=' + encodeURIComponent(topic))
    .join('&');
  const subscribeUrl = hubUrl + '?' + queryString;

  console.log('[Mercure] Subscribing to:', subscribeUrl);

  const eventSource = new EventSource(subscribeUrl);

  eventSource.addEventListener('message', (event: any) => {
    try {
      const data = JSON.parse(event.data);
      console.log('[Mercure] Received update:', data);
      onMessage(data);
    } catch (e) {
      console.warn('[Mercure] Failed to parse message:', event.data);
      onMessage(event.data);
    }
  });

  eventSource.addEventListener('error', (error: any) => {
    console.warn('[Mercure] EventSource error:', error);
    if (onError) {
      onError(error);
    }
  });

  eventSource.addEventListener('open', () => {
    console.log('[Mercure] Connection opened for topics:', topics);
  });

  return {
    close: () => {
      console.log('[Mercure] Closing subscription for topics:', topics);
      eventSource.close();
    },
    topics,
  };
}

/**
 * Decode a JWT token to extract the payload (without verification).
 * Used to get user info for topic subscriptions.
 */
export function decodeJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('[Mercure] Failed to decode JWT:', e);
    return null;
  }
}

// Topic builders
export const MercureTopics = {
  /**
   * Topic for a specific user's booking updates
   * The backend publishes to this topic when a booking status changes
   */
  userBookings: (username: string) => `/bookings/${username}`,

  /**
   * Topic for room availability updates (global)
   * The backend publishes to this topic when room status changes
   */
  rooms: () => '/rooms',

  /**
   * Topic for a specific room update
   */
  room: (roomId: number) => `/rooms/${roomId}`,
};
