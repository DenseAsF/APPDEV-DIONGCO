import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const login = async (username: string, password: string) => {
  const data = await api('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  // Response contains { token: "xxx.yyy.zzz" }
  await AsyncStorage.setItem('jwt_token', data.token);
  return data;
};

export const getProfile = () => api('/api/customer/profile');

export const updateProfile = (data: { firstName?: string; lastName?: string; email?: string }) =>
  api('/api/customer/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const changePassword = (currentPassword: string, newPassword: string) =>
  api('/api/customer/profile/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const logout = async () => {
  await AsyncStorage.removeItem('jwt_token');
};
