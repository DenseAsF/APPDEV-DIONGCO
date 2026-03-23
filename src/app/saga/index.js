import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import homeSaga from './homeSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(homeSaga),
  ]);
}
