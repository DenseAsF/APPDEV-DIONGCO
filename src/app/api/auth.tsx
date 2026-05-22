import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterData, AuthResponse } from '../../types';
import { hashPassword } from '../../utils/crypto';

const BASE_URL = 'http://192.168.1.65:8000/api';

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

async function safeJson(response: Response): Promise<ApiErrorData | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function safeSetItem(key: string, value: string): Promise<void> {
  try {
    if (!AsyncStorage || typeof AsyncStorage.setItem !== 'function') return;
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // Silently fail
  }
}

async function safeGetItem(key: string): Promise<string | null> {
  try {
    if (!AsyncStorage || typeof AsyncStorage.getItem !== 'function') return null;
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

async function safeRemoveItem(key: string): Promise<void> {
  try {
    if (!AsyncStorage || typeof AsyncStorage.removeItem !== 'function') return;
    await AsyncStorage.removeItem(key);
  } catch (e) {

  }
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    console.log('[auth.login] Attempting login to:', `${BASE_URL}/login`);
    console.log('[auth.login] Credentials:', { username, passwordHash: password.substring(0, 10) + '...' });
    
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });

    console.log('[auth.login] Response status:', response.status);
    const data = await safeJson(response);
    console.log('[auth.login] Response data:', data);

    if (!response.ok) {
      const errorMsg = getApiErrorMessage(data, `HTTP ${response.status}`);
      console.error('[auth.login] Login error:', errorMsg);
      throw new Error(errorMsg);
    }

    if (!data || !('token' in data) || typeof data.token !== 'string') {
      console.error('[auth.login] Invalid response format:', data);
      throw new Error('Invalid response: missing token');
    }

    console.log('[auth.login] Login successful, saving token');
    await safeSetItem('authToken', data.token);
    return data as AuthResponse;
  } catch (error: any) {
    console.error('[auth.login] Login exception:', error.message || error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function register(
  username: string,
  email: string,
  password: string,
  name: string,
  phone: string,
  age: string,
  accountNumber?: string
): Promise<AuthResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, name, phone, age, accountNumber }),
      signal: controller.signal,
    });

    const data = await safeJson(response);

    if (!response.ok) {
      throw new Error(getApiErrorMessage(data, 'Registration failed'));
    }

    if (!data || !('token' in data) || typeof data.token !== 'string') {
      throw new Error('Invalid response: missing token');
    }

    await safeSetItem('authToken', data.token);
    return data as AuthResponse;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getAuthToken(): Promise<string | null> {
  return await safeGetItem('authToken');
}

export async function logout(): Promise<void> {
  await safeRemoveItem('authToken');
}
