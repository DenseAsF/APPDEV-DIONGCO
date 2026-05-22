import api from './api';

export const getRooms = (params?: { type?: string; available?: boolean }) => {
  const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
  return api(`/api/customer/rooms${query}`);
};

export const getRoom = (id: number) => api(`/api/customer/rooms/${id}`);

export const getServices = () => api('/api/customer/services');

export const getBookings = () => api('/api/customer/bookings');

export const getBooking = (id: number) => api(`/api/customer/bookings/${id}`);

export const createBooking = (data: {
  roomId: number;
  checkIn: string;  // "YYYY-MM-DD"
  checkOut: string;
  services?: number[];
}) =>
  api('/api/customer/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const cancelBooking = (id: number) =>
  api(`/api/customer/bookings/${id}/cancel`, { method: 'PUT' });
