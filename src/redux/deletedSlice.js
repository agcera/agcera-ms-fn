import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

export const getAllDeleted = createAsyncThunk('history/getAllDeleted', async () => {
  const response = await axiosInstance.get(`history/deleted`);
  return response.data.data;
});

const deletedAdapter = createEntityAdapter();

const { selectAll } = deletedAdapter.getSelectors((state) => state.deleted);

const deletedSlice = createSlice({
  name: 'deleted',
  initialState: deletedAdapter.getInitialState(),
  extraReducers: (builder) => {
    builder.addCase(getAllDeleted.fulfilled, (state, { payload }) => {
      console.log(payload, 'payload');
      deletedAdapter.upsertMany(state, payload.data);
    });
  },
});

export const selectAllDeleted = selectAll;

export default deletedSlice;
