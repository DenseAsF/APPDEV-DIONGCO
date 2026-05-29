import EventSource from 'react-native-sse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMercureHubUrl } from '../config';
import { getApiBaseUrl } from '../config';

export type MercureEventCallback = (data: any) => void;

export interface MercureSubscription {
  close: () => void;
  topics: string[];
}

async function getMercureToken(): Promise<string | null> {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) return null;

    const response = await fetch(`${getApiBaseUrl()}/mercure-token`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.token;
  } catch (e) {
    console.error('[Mercure] Failed to get Mercure token:', e);
    return null;
  }
}

export async function subscribeToMercureAsync(
  topics: string[],
  onMessage: MercureEventCallback,
  onError?: (error: any) => void,
): Promise<MercureSubscription> {
  const hubUrl = getMercureHubUrl();
  const token = await AsyncStorage.getItem('authToken');

  const queryString = topics
    .map(topic => 'topic=' + encodeURIComponent(topic))
    .join('&');
  const subscribeUrl = hubUrl + '?' + queryString;

  console.log('[Mercure] Subscribing to:', subscribeUrl);

  const eventSource = new EventSource(subscribeUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

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
    if (onError) onError(error);
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

// Keep sync version for backward compat but have it call async internally
export function subscribeToMercure(
  topics: string[],
  onMessage: MercureEventCallback,
  onError?: (error: any) => void,
): MercureSubscription {
  const hubUrl = getMercureHubUrl();

  const queryString = topics
    .map(topic => 'topic=' + encodeURIComponent(topic))
    .join('&');
  const subscribeUrl = hubUrl + '?' + queryString;

  let eventSource: any;

  // Get Mercure-specific token (not the Symfony JWT)
  getMercureToken().then(mercureToken => {
    eventSource = new EventSource(subscribeUrl, {
      headers: mercureToken ? { Authorization: `Bearer ${mercureToken}` } : {},
    });

    eventSource.addEventListener('message', (event: any) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        onMessage(event.data);
      }
    });

    eventSource.addEventListener('error', (error: any) => {
      console.warn('[Mercure] EventSource error:', error);
      if (onError) onError(error);
    });

    eventSource.addEventListener('open', () => {
      console.log('[Mercure] Connection opened for topics:', topics);
    });
  });

  return {
    close: () => {
      if (eventSource) eventSource.close();
    },
    topics,
  };
}

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

export const MercureTopics = {
  userBookings: (username: string) => `/bookings/${username}`,
  rooms: () => '/rooms',
  room: (roomId: number) => `/rooms/${roomId}`,
};