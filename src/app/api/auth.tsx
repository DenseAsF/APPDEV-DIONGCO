import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterData, AuthResponse } from '../../types';

const BASE_URL = 'http://10.156.211.23:8000/api';

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
    // Silently fail
  }
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  // Hardcoded credentials for testing without API
  if (username === 'Admin123' && password === 'Admin123') {
    const mockData: AuthResponse = {
      token: 'mock-jwt-token-for-testing',
      user: { username: 'Admin123' }
    };
    await safeSetItem('authToken', mockData.token);
    return mockData;
  }

  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, 'Login failed'));
  }

  if (data && 'token' in data && typeof data.token === 'string') {
    await safeSetItem('authToken', data.token);
  }

  return data as AuthResponse;
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
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, name, phone, age, accountNumber }),
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, 'Registration failed'));
  }

  return data as AuthResponse;
}

export async function getAuthToken(): Promise<string | null> {
  return await safeGetItem('authToken');
}

export async function logout(): Promise<void> {
  await safeRemoveItem('authToken');
}
