import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { formatQuery } from '../utils/formatters';

export const getAllTransactions = createAsyncThunk('transactions/getAllTransactions', async (query) => {
  const response = await axiosInstance.get(`/transactions/${formatQuery(query)}`);
  const data = response.data;
  return {
    ...data,
    data: {
      ...data.data,
      transactions: data.data.transactions.map((t) => ({ ...t, amount: parseFloat(t.amount || 0) })),
    },
  };
});

const transactionsAdapter = createEntityAdapter();

const { selectAll, selectById } = transactionsAdapter.getSelectors((state) => state.transactions);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState(),
  extraReducers: (builder) => {
    builder.addCase(getAllTransactions.fulfilled, (state, { payload }) => {
      transactionsAdapter.upsertMany(state, payload.data.transactions);
    });
  },
});

export const selectAllTransactions = selectAll;
export const selectTransactionById = (id) => (state) => selectById(state, id);

export default transactionsSlice;
