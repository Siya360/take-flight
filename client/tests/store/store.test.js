import { createStore } from 'redux';
import store from '../store'; // Adjust the import path as necessary
import { getFlightsBegin, getFlightsSuccess, getFlightsFailure } from '../actions/flightActions';

describe('Redux Store', () => {
  let testStore;

  beforeEach(() => {
    // Create a fresh store before each test
    testStore = createStore(store.reducer, store.middleware);
  });

  test('initial state of the flights reducer', () => {
    const state = testStore.getState().flights;
    expect(state).toEqual({
      items: [],
      loading: false,
      error: null,
    });
  });

  test('handle getFlightsBegin action', () => {
    testStore.dispatch(getFlightsBegin());
    const state = testStore.getState().flights;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.items).toEqual([]);
  });

  test('handle getFlightsSuccess action', () => {
    const mockFlights = [{ id: 1, name: 'Test Flight' }];
    testStore.dispatch(getFlightsSuccess({ flights: mockFlights }));
    const state = testStore.getState().flights;
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockFlights);
    expect(state.error).toBeNull();
  });

  test('handle getFlightsFailure action', () => {
    const mockError = 'Error fetching flights';
    testStore.dispatch(getFlightsFailure({ error: mockError }));
    const state = testStore.getState().flights;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError);
    expect(state.items).toEqual([]);
  });

  // Add more tests as needed for other actions and reducers
});
