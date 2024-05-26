import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { formatQuery } from '../utils/formatters';

const salesAdapter = createEntityAdapter();

export const getSaleAction = createAsyncThunk('sales/getSaleAction', async (id) => {
  const response = await axiosInstance.get(`/sales/${id}`);
  return response.data;
});

export const getAllSalesAction = createAsyncThunk('sales/getAllSalesAction', async (query) => {
  const response = await axiosInstance.get(`/sales?${formatQuery(query)}`);
  return response.data;
});

export const createSaleAction = createAsyncThunk('sales/createSaleAction', async (data) => {
  const response = await axiosInstance.post('/sales', data);
  return response.data;
});

export const deleteSaleAction = createAsyncThunk('sales/deleteSaleAction', async (id) => {
  const response = await axiosInstance.patch(`/sales/${id}`);
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
        salesAdapter.upsertOne(state, payload.data);
      })
      .addCase(getAllSalesAction.fulfilled, (state, { payload }) => {
        salesAdapter.upsertMany(state, payload.data.sales);
      })
      .addCase(deleteSaleAction.fulfilled, (state, { meta }) => {
        salesAdapter.removeOne(state, meta.arg);
      });
  },
});

export const selectAllSales = selectAll;
export const selectSaleById = (id) => (state) => selectById(state, id);

export default salesSlice;
