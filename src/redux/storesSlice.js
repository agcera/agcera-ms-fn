import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

export const getAllStoresAction = createAsyncThunk('stores/getAllStoresAction', async () => {
  const response = await axiosInstance.get(`/stores`);
  return response.data;
});
export const getStoreAction = createAsyncThunk('stores/getStoreAction', async (id) => {
  const response = await axiosInstance.get(`/stores/${id}`);
  return response.data;
});

const storesAdapter = createEntityAdapter();

const { selectAll, selectById } = storesAdapter.getSelectors((state) => state.stores);

const storesSlice = createSlice({
  name: 'stores',
  initialState: storesAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStoresAction.fulfilled, (state, { payload }) => {
        storesAdapter.upsertMany(state, payload.data.stores);
      })
      .addCase(getStoreAction.fulfilled, (state, { payload }) => {
        storesAdapter.upsertOne(state, payload.data);
      });
  },
});

export const selectAllStores = selectAll;
export const selectStoreById = (id) => (state) => selectById(state, id);

export default storesSlice;
