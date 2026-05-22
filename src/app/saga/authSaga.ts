import { takeLatest, put, call } from 'redux-saga/effects';
import { login, logout as logoutApi } from '../api/auth';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
} from '../actions/authActions';
import { LoginRequestAction } from '../../types';

function* loginSaga(action: LoginRequestAction): Generator {
  try {
    const { username, password } = action.payload;
    console.log('[authSaga] loginSaga starting for user:', username);
    
    const response: any = yield call(login, username, password);
    console.log('[authSaga] login() response:', response ? Object.keys(response) : 'null');
    
    if (!response) {
      throw new Error('Empty response from login');
    }
    
    if (!response.token) {
      throw new Error('No token in response');
    }
    
    if (response.token) {
      console.log('[authSaga] Successfully logged in. JWT Token:', response.token.substring(0, 20) + '...');
    }
    
    yield put({
      type: LOGIN_SUCCESS,
      payload: {
        user: response.user || { username },
        token: response.token,
      },
    });
    console.log('[authSaga] loginSaga completed successfully');
  } catch (error: any) {
    console.error('[authSaga] loginSaga error:', error.message || error);
    yield put({
      type: LOGIN_FAILURE,
      payload: {
        error: error.message || 'Login failed',
      },
    });
  }
}

function* logoutSaga() {
  try {
    yield call(logoutApi);
    
    yield put({
      type: LOGOUT_SUCCESS,
    });
  } catch (error: any) {
    yield put({
      type: LOGOUT_FAILURE,
      payload: {
        error: error.message || 'Logout failed',
      },
    });
  }
}

export default function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
  yield takeLatest(LOGOUT_REQUEST, logoutSaga);
}
