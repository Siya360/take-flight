import { fetchFlights } from '../../utils/api';

// Action Types
export const GET_FLIGHTS_BEGIN = 'GET_FLIGHTS_BEGIN';
export const GET_FLIGHTS_SUCCESS = 'GET_FLIGHTS_SUCCESS';
export const GET_FLIGHTS_FAILURE = 'GET_FLIGHTS_FAILURE';

// Action Creators
export const getFlightsBegin = () => ({
  type: GET_FLIGHTS_BEGIN,
});

export const getFlightsSuccess = flights => ({
  type: GET_FLIGHTS_SUCCESS,
  payload: { flights },
});

export const getFlightsFailure = error => ({
  type: GET_FLIGHTS_FAILURE,
  payload: { error },
});

// Thunk for fetching flights
export function getFlights() {
  return dispatch => {
    dispatch(getFlightsBegin());
    fetchFlights()
      .then(json => {
        dispatch(getFlightsSuccess(json));
      })
      .catch(error => dispatch(getFlightsFailure(error)));
  };
}
