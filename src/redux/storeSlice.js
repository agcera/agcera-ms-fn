import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

const storeAdapter = createEntityAdapter();

export const getStoreAction = createAsyncThunk('store/getStoreAction', async (id) => {
  const response = await axiosInstance.get(`/stores/${id}`);
  return response.data;
});

export const getAllStoreAction = createAsyncThunk('/store/getAllStoresAction', async () => {
  const response = await axiosInstance.get('/stores');
  return response.data;
});

const { selectAll, selectById } = storeAdapter.getSelectors((state) => state.stores);

const storesSlice = createSlice({
  name: 'stores',
  initialState: storeAdapter.getInitialState(),

  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(getStoreAction.fulfilled, (state, action) => {
      //   storeAdapter.setOne(state, action.payload.data);
      // })

      .addCase(getAllStoreAction.fulfilled, (state, action) => {
        console.log('we are fullfilled');
        console.log(action.payload);
        storeAdapter.setAll(state, action.payload.data);
      });
  },
});

export const selectAllStores = selectAll;
export const selectStoreById = (id) => (state) => selectById(state, id);

export default storesSlice;
