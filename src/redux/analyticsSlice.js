import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { formatQuery } from '../utils/formatters';
import axiosInstance from '../axios';

export const getAnalytics = createAsyncThunk('analytics/getAnalytics', async (data) => {
  const response = await axiosInstance.get(`/analytics?${formatQuery(data)}`);
  return response.data;
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { data: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAnalytics.fulfilled, (state, { payload }) => {
      state.data = payload.data;
    });
  },
});

export const selectAllanalytics = (state) => {
  return state.analytics.data;
};

export default analyticsSlice;
