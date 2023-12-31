import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import flightReducer from './reducers/flightReducer';

const store = configureStore({
  reducer: {
    flights: flightReducer,
    // Add other reducers here when needed
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
