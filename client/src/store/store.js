import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import flightReducer from './reducers/flightReducer';

// Combine all reducers to create a single root reducer
const rootReducer = combineReducers({
  flights: flightReducer,
  // Add other reducers here when needed
});

// Apply middleware to the store
const middleware = applyMiddleware(thunk);

// Create the Redux store
const store = createStore(rootReducer, middleware);

export default store;
