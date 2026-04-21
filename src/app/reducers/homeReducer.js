import { 
  TOGGLE_MENU, 
  FETCH_ROOMS_REQUEST, 
  FETCH_ROOMS_SUCCESS, 
  FETCH_ROOMS_FAILURE,
  FETCH_AMENITIES_REQUEST,
  FETCH_AMENITIES_SUCCESS,
  FETCH_AMENITIES_FAILURE,
  SCROLL_TO_SECTION
} from '../actions/homeActions';

const initialState = {
  menuVisible: false,
  rooms: [],
  amenities: [],
  sectionLayouts: {},
  loading: {
    rooms: false,
    amenities: false,
  },
  error: {
    rooms: null,
    amenities: null,
  },
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      return {
        ...state,
        menuVisible: !state.menuVisible,
      };
    case FETCH_ROOMS_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          rooms: true,
        },
        error: {
          ...state.error,
          rooms: null,
        },
      };
    case FETCH_ROOMS_SUCCESS:
      return {
        ...state,
        loading: {
          ...state.loading,
          rooms: false,
        },
        rooms: action.payload.rooms,
      };
    case FETCH_ROOMS_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          rooms: false,
        },
        error: {
          ...state.error,
          rooms: action.payload.error,
        },
      };
    case FETCH_AMENITIES_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          amenities: true,
        },
        error: {
          ...state.error,
          amenities: null,
        },
      };
    case FETCH_AMENITIES_SUCCESS:
      return {
        ...state,
        loading: {
          ...state.loading,
          amenities: false,
        },
        amenities: action.payload.amenities,
      };
    case FETCH_AMENITIES_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          amenities: false,
        },
        error: {
          ...state.error,
          amenities: action.payload.error,
        },
      };
    case SCROLL_TO_SECTION:
      return {
        ...state,
        sectionLayouts: {
          ...state.sectionLayouts,
          [action.payload.sectionName]: action.payload.yPosition,
        },
      };
    default:
      return state;
  }
};

export default homeReducer;
