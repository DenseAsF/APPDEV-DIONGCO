import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types';
import { getApiBaseUrl } from '../config';

const BASE_URL = getApiBaseUrl();

interface ApiErrorData {
  message?: string;
  detail?: string;
  'hydra:description'?: string;
  violations?: Array<{ message: string }>;
}

function getApiErrorMessage(data: ApiErrorData | null, fallback: string): string {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.detail === 'string' && data.detail.trim()) return data.detail;
  if (typeof data['hydra:description'] === 'string' && data['hydra:description'].trim()) {
    return data['hydra:description'];
  }
  if (Array.isArray(data.violations) && data.violations.length > 0) {
    const first = data.violations[0];
    if (first?.message) return first.message;
  }
  return fallback;
}

async function safeJson(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    console.log('[googleAuth] Starting Google Sign-In...');

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();
    console.log('[googleAuth] Google Sign-In successful');

    const { idToken } = response.data ?? {};

    if (!idToken) {
      throw new Error('No ID token received from Google');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const backendResponse = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data: any = await safeJson(backendResponse);
      console.log('[googleAuth] Backend response status:', backendResponse.status);
      console.log('[googleAuth] Backend response data:', JSON.stringify(data, null, 2));

      if (!backendResponse.ok) {
        const errorMsg = getApiErrorMessage(data, `HTTP ${backendResponse.status}`);
        console.error('[googleAuth] Backend error:', errorMsg);
        throw new Error(errorMsg);
      }

      if (!data) {
        console.error('[googleAuth] Response is null or empty');
        throw new Error('Invalid response from backend: empty response');
      }

      if (!('token' in data)) {
        console.error('[googleAuth] Response missing token field. Keys:', Object.keys(data));
        throw new Error('Invalid response from backend: missing token');
      }

      if (typeof data.token !== 'string') {
        console.error('[googleAuth] Token is not a string:', typeof data.token);
        throw new Error('Invalid response from backend: token is not a string');
      }

      // ✅ STORE BOTH TOKEN AND USER
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      console.log('[googleAuth] Token and user saved successfully');

      return data as AuthResponse;
    } catch (error: any) {
      clearTimeout(timeout);
      throw error;
    }
  } catch (error: any) {
    console.error('[googleAuth] Google Sign-In error:', error.message || error);
    throw error;
  }
};

export const signOutFromGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    console.log('[googleAuth] Signed out from Google');
  } catch (error: any) {
    console.error('[googleAuth] Sign out error:', error.message || error);
    throw error;
  }
};
