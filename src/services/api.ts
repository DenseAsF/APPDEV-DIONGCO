import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://192.168.1.65:8000';

const api = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('jwt_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { status: response.status, ...error };
  }

  return response.json();
};

export default api;
