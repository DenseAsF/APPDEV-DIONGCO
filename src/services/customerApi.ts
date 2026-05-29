import { getAuthToken } from '../app/api/auth';
import { getApiBaseUrl } from '../config';
const BASE_URL = getApiBaseUrl();

// Types
export interface Room {
  id: number;
  name: string;
  type: string;
  description?: string;
  pricePerNight: number;
  capacity: number;
  amenities?: string[];
  images?: string[];
  isAvailable: boolean;
  // Backend API fields
  roomNumber?: string;
  maxPeople?: number;
  price?: string;
  roomType?: {
    id: number;
    name: string;
  };
  status?: {
    id: number;
    name: string;
  };
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
}

export interface Booking {
  id: number;
  room: Room;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'Booked';
  totalPrice: number;
  // Backend fields
  checkInDate?: string;
  checkOutDate?: string;
  total_price?: number;
  check_in?: string;
  check_out?: string;
  special_requests?: string;
  services?: Service[];
  guestCount?: number;
  specialRequests?: string;
  createdAt?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  age?: string;
  roles?: string[];
  isVerified?: boolean;
}

export interface CreateBookingData {
  room_id: number;
  check_in: string;
  check_out: string;
  services?: number[];
  guestCount?: number;
  specialRequests?: string;
}

// Helper function for authenticated requests
async function authRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || error.error || `HTTP ${response.status}`,
      ...error,
    };
  }

  return response.json();
}

// Customer API Service
export const customerApi = {
  // Profile
  getProfile: (): Promise<UserProfile> => 
    authRequest('/customer/profile'),

  updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> => 
    authRequest('/customer/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string): Promise<void> => 
    authRequest('/customer/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Rooms
  getRooms: (filters?: { type?: string; available?: boolean }): Promise<{ rooms: Room[] }> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.available !== undefined) params.append('available', String(filters.available));
    const query = params.toString() ? `?${params.toString()}` : '';
    return authRequest(`/customer/rooms${query}`);
  },

  getRoom: (id: number): Promise<Room> => 
    authRequest(`/customer/rooms/${id}`),

  // Services
  getServices: (): Promise<{ services: Service[] }> => 
    authRequest('/customer/services'),

  // Bookings
  getBookings: (): Promise<{ bookings: Booking[] }> => 
    authRequest('/customer/bookings'),

  getBooking: (id: number): Promise<Booking> => 
    authRequest(`/customer/bookings/${id}`),

  createBooking: (data: CreateBookingData): Promise<Booking> => 
    authRequest('/customer/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelBooking: (id: number): Promise<Booking> => 
    authRequest(`/customer/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({}),
    }),
};

export default customerApi;
