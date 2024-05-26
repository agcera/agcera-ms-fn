import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import analyticsSlice from './analyticsSlice';
import deletedSlice from './deletedSlice';
import movementsSlice from './historySlice';
import productsSlice from './productsSlice';
import salesSlice from './salesSlice';
import storesSlice from './storesSlice';
import transactionsSlice from './transactionsSlice';
import usersSlice from './usersSlice';

const middlewares = [];

const logger = createLogger({
  collapsed: (getState, action, logEntry) => !logEntry.error,
});

middlewares.push(logger);

const slices = combineSlices(
  usersSlice,
  productsSlice,
  storesSlice,
  salesSlice,
  analyticsSlice,
  transactionsSlice,
  movementsSlice,
  deletedSlice
);

const store = configureStore({
  reducer: (state, action) => {
    if (action.type === 'reset') {
      state = undefined;
    }
    return slices(state, action);
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
});

export const resetStoreAction = () => {
  return {
    type: 'reset',
  };
};

export default store;
