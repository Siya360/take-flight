// flightReducer.test.js
import flightReducer from '../../src/store/reducers/flightReducer';
import * as types from '../../src/store/actions/flightActions';

describe('flightReducer', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(flightReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle GET_FLIGHTS_BEGIN', () => {
    const startAction = {
      type: types.GET_FLIGHTS_BEGIN,
    };
    expect(flightReducer(initialState, startAction)).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it('should handle GET_FLIGHTS_SUCCESS', () => {
    const successAction = {
      type: types.GET_FLIGHTS_SUCCESS,
      payload: { flights: [{ id: 1, name: 'Test Flight' }] },
    };
    expect(flightReducer(initialState, successAction)).toEqual({
      ...initialState,
      loading: false,
      items: [{ id: 1, name: 'Test Flight' }],
    });
  });

  it('should handle GET_FLIGHTS_FAILURE', () => {
    const failureAction = {
      type: types.GET_FLIGHTS_FAILURE,
      payload: { error: 'Test error' },
    };
    expect(flightReducer(initialState, failureAction)).toEqual({
      ...initialState,
      loading: false,
      error: 'Test error',
      items: [],
    });
  });
});
