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

function* loginSaga(action) {
  try {
    const { username, password } = action.payload;
    const response = yield call(login, username, password);
    
    if (response.token) {
      console.log('Successfully logged in. JWT Token:', response.token);
    }
    
    yield put({
      type: LOGIN_SUCCESS,
      payload: {
        user: response.user || { username },
        token: response.token,
      },
    });
  } catch (error) {
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
  } catch (error) {
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
