import { combineSlices, configureStore } from '@reduxjs/toolkit';
import usersSlice from './usersSlice';
import { createLogger } from 'redux-logger';
import productsSlice from './productsSlice';

const middlewares = [];

const logger = createLogger({
  collapsed: (getState, action, logEntry) => !logEntry.error,
});

middlewares.push(logger);

const store = configureStore({
  reducer: combineSlices(usersSlice, productsSlice),
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
});

export default store;
