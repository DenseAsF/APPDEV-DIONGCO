import { takeLatest, put, call, select } from 'redux-saga/effects';
import {
  TOGGLE_MENU,
  SET_CURRENT_SLIDE,
  FETCH_ROOMS_REQUEST,
  FETCH_ROOMS_SUCCESS,
  FETCH_ROOMS_FAILURE,
  FETCH_AMENITIES_REQUEST,
  FETCH_AMENITIES_SUCCESS,
  FETCH_AMENITIES_FAILURE,
  SCROLL_TO_SECTION,
} from '../actions/homeActions';


const fetchRoomsAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Deluxe Room', description: 'Spacious and comfortable, perfect for relaxation.', price: 150 },
        { id: 2, name: 'Suite Room', description: 'Luxury suite with a private balcony and city view.', price: 250 },
        { id: 3, name: 'Standard Room', description: 'Cozy and affordable, ideal for short stays.', price: 100 },
      ]);
    }, 1000);
  });
};

const fetchAmenitiesAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Spa', description: 'Relax and rejuvenate with our luxury spa treatments.' },
        { id: 2, name: 'Restaurant', description: 'Enjoy world-class cuisine prepared by our top chefs.' },
        { id: 3, name: 'Gym', description: 'Stay fit with modern equipment and spacious workout areas.' },
        { id: 4, name: 'Pool', description: 'Take a refreshing swim in our outdoor infinity pool.' },
        { id: 5, name: 'Bar', description: 'Unwind with cocktails and music at our stylish lounge bar.' },
      ]);
    }, 1000);
  });
};

function* fetchRoomsSaga() {
  try {
    const rooms = yield call(fetchRoomsAPI);
    yield put({
      type: FETCH_ROOMS_SUCCESS,
      payload: { rooms },
    });
  } catch (error) {
    yield put({
      type: FETCH_ROOMS_FAILURE,
      payload: { error: error.message },
    });
  }
}

function* fetchAmenitiesSaga() {
  try {
    const amenities = yield call(fetchAmenitiesAPI);
    yield put({
      type: FETCH_AMENITIES_SUCCESS,
      payload: { amenities },
    });
  } catch (error) {
    yield put({
      type: FETCH_AMENITIES_FAILURE,
      payload: { error: error.message },
    });
  }
}

export default function* homeSaga() {
  yield takeLatest(FETCH_ROOMS_REQUEST, fetchRoomsSaga);
  yield takeLatest(FETCH_AMENITIES_REQUEST, fetchAmenitiesSaga);
}
