import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

const salesAdapter = createEntityAdapter();

export const getSaleAction = createAsyncThunk('sale/getSaleAction', async (id) => {
  const response = await axiosInstance.get(`/sales/${id}`);
  return response.data;
});

export const getAllSalesAction = createAsyncThunk('sale/getAllSalesAction', async () => {
  const response = await axiosInstance.get('/sales');
  return response.data;
});

const { selectAll, selectById } = salesAdapter.getSelectors((state) => state.sales);

const salesSlice = createSlice({
  name: 'sales',
  initialState: salesAdapter.getInitialState(),

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSaleAction.fulfilled, (state, { payload }) => {
        salesAdapter.setOne(state, payload.data);
      })
      .addCase(getAllSalesAction.fulfilled, (state, { payload }) => {
        salesAdapter.setAll(state, payload.message.sales);
      });
  },
});

export const selectAllSales = selectAll;
export const selectStoreById = (id) => (state) => selectById(state, id);

export default salesSlice;
