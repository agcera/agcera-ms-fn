import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

export const getAllDeleted = createAsyncThunk('history/getAllDeleted', async () => {
  const response = await axiosInstance.get(`history/deleted`);
  return response.data.data;
});

export const getDeletedItemByIdAction = createAsyncThunk('history/getDeletedItemByIdAction', async (id) => {
  const response = await axiosInstance.get(`history/deleted/${id}`);
  return response.data.data;
});

const deletedAdapter = createEntityAdapter();

const { selectAll, selectById } = deletedAdapter.getSelectors((state) => state.deleted);

const deletedSlice = createSlice({
  name: 'deleted',
  initialState: deletedAdapter.getInitialState(),
  extraReducers: (builder) => {
    builder
      .addCase(getAllDeleted.fulfilled, (state, { payload }) => {
        console.log(payload, 'payload');
        deletedAdapter.upsertMany(state, payload.deletedItems);
      })
      .addCase(getDeletedItemByIdAction.fulfilled, (state, { payload }) => {
        deletedAdapter.upsertOne(state, payload.deletedItem);
      });
  },
});

export const selectAllDeleted = selectAll;
export const selectDeletedById = (id) => (state) => selectById(state, id);

export default deletedSlice;
