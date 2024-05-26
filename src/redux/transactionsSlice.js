import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { formatQuery } from '../utils/formatters';

export const getAllTransactionsAction = createAsyncThunk('transactions/getAllTransactionsAction', async (query) => {
  const response = await axiosInstance.get(`/transactions?${formatQuery(query)}`);
  const data = response.data;
  return {
    ...data,
    data: {
      ...data.data,
      transactions: data.data.transactions.map((t) => ({ ...t, amount: parseFloat(t.amount || 0) })),
    },
  };
});
export const createTransactionAction = createAsyncThunk('transactions/createTransactionAction', async (data) => {
  const response = await axiosInstance.post(`/transactions`, data);
  return response.data;
});

const transactionsAdapter = createEntityAdapter();

const { selectAll, selectById } = transactionsAdapter.getSelectors((state) => state.transactions);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState(),
  extraReducers: (builder) => {
    builder
      .addCase(getAllTransactionsAction.fulfilled, (state, { payload }) => {
        transactionsAdapter.upsertMany(state, payload.data.transactions);
      })
      .addCase(createTransactionAction.fulfilled, (state, { payload }) => {
        transactionsAdapter.upsertOne(state, payload.data);
      });
  },
});

export const selectAllTransactions = selectAll;
export const selectTransactionById = (id) => (state) => selectById(state, id);

export default transactionsSlice;
