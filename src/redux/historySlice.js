import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { formatQuery } from '../utils/formatters';

export const getAllMovements = createAsyncThunk('history/getAllMovements', async (query) => {
  const response = await axiosInstance.get(`history/movements?${formatQuery(query)}`);
  return response.data;
});

const movementsAdapter = createEntityAdapter();

const { selectAll } = movementsAdapter.getSelectors((state) => state.movements);

const movementsSlice = createSlice({
  name: 'movements',
  initialState: movementsAdapter.getInitialState(),
  extraReducers: (builder) => {
    builder.addCase(getAllMovements.fulfilled, (state, { payload }) => {
      console.log(payload, 'payload');
      movementsAdapter.upsertMany(state, payload.data.movements);
    });
  },
});

export const selectAllMovements = selectAll;
export default movementsSlice;
