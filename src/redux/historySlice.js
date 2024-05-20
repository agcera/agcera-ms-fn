import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

export const getAllMovements = createAsyncThunk('history/getAllMovements', async () => {
  const response = await axiosInstance.get(`history/movements`);
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
