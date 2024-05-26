import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { formatQuery } from '../utils/formatters';

export const getAllDeleted = createAsyncThunk('history/getAllDeleted', async (query) => {
  const response = await axiosInstance.get(`history/deleted?${formatQuery(query)}`);
  return response.data;
});

export const getDeletedItemByIdAction = createAsyncThunk('history/getDeletedItemByIdAction', async (id) => {
  const response = await axiosInstance.get(`history/deleted/${id}`);
  return response.data;
});

const deletedAdapter = createEntityAdapter();

const { selectAll, selectById } = deletedAdapter.getSelectors((state) => state.deleted);

const deletedSlice = createSlice({
  name: 'deleted',
  initialState: deletedAdapter.getInitialState(),
  extraReducers: (builder) => {
    builder
      .addCase(getAllDeleted.fulfilled, (state, { payload }) => {
        deletedAdapter.upsertMany(state, payload.data.deletedItems);
      })
      .addCase(getDeletedItemByIdAction.fulfilled, (state, { payload }) => {
        deletedAdapter.upsertOne(state, payload.data.deletedItem);
      });
  },
});

export const selectAllDeleted = selectAll;
export const selectDeletedById = (id) => (state) => selectById(state, id);

export default deletedSlice;
