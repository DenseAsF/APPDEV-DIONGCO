import { AuthAction, LoginCredentials, AuthResponse } from '../../types';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const GOOGLE_SIGN_IN_REQUEST = 'GOOGLE_SIGN_IN_REQUEST';
export const GOOGLE_SIGN_IN_SUCCESS = 'GOOGLE_SIGN_IN_SUCCESS';
export const GOOGLE_SIGN_IN_FAILURE = 'GOOGLE_SIGN_IN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const loginRequest = (credentials: LoginCredentials): AuthAction => ({
  type: LOGIN_REQUEST,
  payload: credentials,
});

export const loginSuccess = (user: AuthResponse['user'], token: string): AuthAction => ({
  type: LOGIN_SUCCESS,
  payload: { user, token },
});

export const loginFailure = (error: string): AuthAction => ({
  type: LOGIN_FAILURE,
  payload: { error },
});

export const googleSignInRequest = (): AuthAction => ({
  type: GOOGLE_SIGN_IN_REQUEST,
});

export const googleSignInSuccess = (user: AuthResponse['user'], token: string): AuthAction => ({
  type: GOOGLE_SIGN_IN_SUCCESS,
  payload: { user, token },
});

export const googleSignInFailure = (error: string): AuthAction => ({
  type: GOOGLE_SIGN_IN_FAILURE,
  payload: { error },
});

export const logoutRequest = (): AuthAction => ({
  type: LOGOUT_REQUEST,
});

export const logoutSuccess = (): AuthAction => ({
  type: LOGOUT_SUCCESS,
});

export const logoutFailure = (error: string): AuthAction => ({
  type: LOGOUT_FAILURE,
  payload: { error },
});
