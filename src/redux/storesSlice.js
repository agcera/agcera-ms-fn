import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { formatQuery } from '../utils/formatters';

export const getAllPartialStoresAction = createAsyncThunk('stores/getAllPartialStoresAction', async (query) => {
  const response = await axiosInstance.get(`/stores/all?${formatQuery(query)}`);
  return response.data;
});

export const getAllStoresAction = createAsyncThunk('stores/getAllStoresAction', async (query) => {
  const response = await axiosInstance.get(`/stores?${formatQuery(query)}`);
  return response.data;
});
export const getStoreAction = createAsyncThunk('stores/getStoreAction', async (id) => {
  const response = await axiosInstance.get(`/stores/${id}`);
  return response.data;
});
export const registerStoreAction = createAsyncThunk('stores/registerStoreAction', async (store) => {
  const response = await axiosInstance.post(`/stores`, store);
  return response.data;
});
export const deleteStoreAction = createAsyncThunk('stores/deleteStoreAction', async (id) => {
  const response = await axiosInstance.delete(`/stores/${id}`);
  return response.data;
});
export const updateStoreAction = createAsyncThunk('stores/updateStoreAction', async ({ id, data }) => {
  const store = {};
  const { name, phone, location, keepers, isActive = null } = data;

  name && (store.name = name);
  phone && (store.phone = phone);
  location && (store.location = location);
  isActive !== null && (store.isActive = isActive);
  keepers?.length > 0 && (store.keepers = keepers);

  const response = await axiosInstance.patch(`/stores/${id}`, store);
  return response.data;
});
export const storeAddMoveProductAction = createAsyncThunk('stores/storeAddMoveProductAction', async (data) => {
  const formattedData = {
    ...data,
    from: data.from || 'main',
    to: data.to || 'expired',
  };
  const response = await axiosInstance.post(`/stores/addProduct`, formattedData);
  return response.data;
});
export const storeCollectProfitAction = createAsyncThunk(
  'stores/storeCollectProfitAction',
  async ({ storeId, from, to }) => {
    const data = { from, to };
    if (storeId) data.storeId = storeId;
    const response = await axiosInstance.post(`/stores/collectProfit`, data);
    return response.data;
  }
);

const storesAdapter = createEntityAdapter();

const { selectAll, selectById } = storesAdapter.getSelectors((state) => state.stores);

const storesSlice = createSlice({
  name: 'stores',
  initialState: storesAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPartialStoresAction.fulfilled, (state, { payload }) => {
        storesAdapter.upsertMany(state, payload.data);
      })
      .addCase(getAllStoresAction.fulfilled, (state, { payload }) => {
        storesAdapter.upsertMany(state, payload.data.stores);
      })
      .addCase(getStoreAction.fulfilled, (state, { payload }) => {
        storesAdapter.upsertOne(state, payload.data);
      })
      .addCase(deleteStoreAction.fulfilled, (state, { meta }) => {
        storesAdapter.removeOne(state, meta.arg);
      })
      .addCase(registerStoreAction.fulfilled, (state, { payload }) => {
        storesAdapter.setOne(state, payload.data);
      })
      .addCase(updateStoreAction.fulfilled, (state, { payload }) => {
        storesAdapter.upsertOne(state, payload.data.store);
      });
  },
});

export const selectAllStores = selectAll;
export const selectStoreById = (id) => (state) => selectById(state, id);

export default storesSlice;
