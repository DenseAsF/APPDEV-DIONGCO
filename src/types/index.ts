// Shared TypeScript types for the application

export interface User {
  username: string;
  email?: string;
  name?: string;
  phone?: string;
  age?: string;
  accountNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  age: string;
  accountNumber?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Room {
  id?: string;
  name: string;
  description: string;
  imageName?: string;
  price?: number;
  image?: any;
}

export interface Amenity {
  id?: string;
  name: string;
  description: string;
  imageName?: string;
  image?: any;
}

export interface HomeState {
  menuVisible: boolean;
  rooms: Room[];
  amenities: Amenity[];
  sectionLayouts: Record<string, number>;
  loading: {
    rooms: boolean;
    amenities: boolean;
  };
  error: {
    rooms: string | null;
    amenities: string | null;
  };
}

export interface RootState {
  auth: AuthState;
  home: HomeState;
}

// Redux Action Types
export interface LoginRequestAction {
  type: 'LOGIN_REQUEST';
  payload: LoginCredentials;
}

export interface LoginSuccessAction {
  type: 'LOGIN_SUCCESS';
  payload: AuthResponse;
}

export interface LoginFailureAction {
  type: 'LOGIN_FAILURE';
  payload: { error: string };
}

export interface LogoutRequestAction {
  type: 'LOGOUT_REQUEST';
}

export interface LogoutSuccessAction {
  type: 'LOGOUT_SUCCESS';
}

export interface LogoutFailureAction {
  type: 'LOGOUT_FAILURE';
  payload: { error: string };
}

export type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutRequestAction
  | LogoutSuccessAction
  | LogoutFailureAction;
