// flightActions.test.js
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../../src/store/actions/flightActions';
import * as api from '../../src/utils/api';

// Create a mock store with thunk middleware
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Mocking the api module and its fetchFlights function
jest.mock('../../src/utils/api', () => ({
  fetchFlights: jest.fn(),
}));

describe('flight actions', () => {
  let store;

  beforeEach(() => {
    // Reset the store before each test
    store = mockStore({ flights: [] });
  });

  it('creates GET_FLIGHTS_SUCCESS when fetching flights has been done', async () => {
    // Mock the API response
    const mockFlights = [{ id: 1, name: 'Test Flight' }];
    api.fetchFlights.mockResolvedValue(mockFlights);

    const expectedActions = [
      { type: actions.GET_FLIGHTS_BEGIN },
      { type: actions.GET_FLIGHTS_SUCCESS, payload: { flights: mockFlights } },
    ];

    // Dispatch the getFlights thunk
    await store.dispatch(actions.getFlights());

    // Test if your store dispatched the expected actions
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates GET_FLIGHTS_FAILURE when fetching flights fails', async () => {
    const error = new Error('Fetch failed');
    api.fetchFlights.mockRejectedValue(error);

    const expectedActions = [
      { type: actions.GET_FLIGHTS_BEGIN },
      { type: actions.GET_FLIGHTS_FAILURE, payload: { error } },
    ];

    // Dispatch the getFlights thunk
    await store.dispatch(actions.getFlights());

    // Test if your store dispatched the expected actions
    expect(store.getActions()).toEqual(expectedActions);
  });
});
