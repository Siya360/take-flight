import {
    GET_FLIGHTS_BEGIN,
    GET_FLIGHTS_SUCCESS,
    GET_FLIGHTS_FAILURE,
  } from '../actions/flightActions';
  
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };
  
  export default function flightReducer(state = initialState, action) {
    switch (action.type) {
      case GET_FLIGHTS_BEGIN:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case GET_FLIGHTS_SUCCESS:
        return {
          ...state,
          loading: false,
          items: action.payload.flights,
        };
      case GET_FLIGHTS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          items: [],
        };
      default:
        return state;
    }
  }
  