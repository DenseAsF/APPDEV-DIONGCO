export const TOGGLE_MENU = 'TOGGLE_MENU';
export const SET_CURRENT_SLIDE = 'SET_CURRENT_SLIDE';
export const FETCH_ROOMS_REQUEST = 'FETCH_ROOMS_REQUEST';
export const FETCH_ROOMS_SUCCESS = 'FETCH_ROOMS_SUCCESS';
export const FETCH_ROOMS_FAILURE = 'FETCH_ROOMS_FAILURE';
export const FETCH_AMENITIES_REQUEST = 'FETCH_AMENITIES_REQUEST';
export const FETCH_AMENITIES_SUCCESS = 'FETCH_AMENITIES_SUCCESS';
export const FETCH_AMENITIES_FAILURE = 'FETCH_AMENITIES_FAILURE';
export const SCROLL_TO_SECTION = 'SCROLL_TO_SECTION';

export const toggleMenu = () => ({
  type: TOGGLE_MENU,
});

export const setCurrentSlide = (slideIndex) => ({
  type: SET_CURRENT_SLIDE,
  payload: { slideIndex },
});

export const fetchRoomsRequest = () => ({
  type: FETCH_ROOMS_REQUEST,
});

export const fetchRoomsSuccess = (rooms) => ({
  type: FETCH_ROOMS_SUCCESS,
  payload: { rooms },
});

export const fetchRoomsFailure = (error) => ({
  type: FETCH_ROOMS_FAILURE,
  payload: { error },
});

export const fetchAmenitiesRequest = () => ({
  type: FETCH_AMENITIES_REQUEST,
});

export const fetchAmenitiesSuccess = (amenities) => ({
  type: FETCH_AMENITIES_SUCCESS,
  payload: { amenities },
});

export const fetchAmenitiesFailure = (error) => ({
  type: FETCH_AMENITIES_FAILURE,
  payload: { error },
});

export const scrollToSection = (sectionName, yPosition) => ({
  type: SCROLL_TO_SECTION,
  payload: { sectionName, yPosition },
});
