import { createAsyncThunk } from '@reduxjs/toolkit';
import { formatQuery } from '../utils/formatters';
import axiosInstance from '../axios';

export const generateReport = createAsyncThunk('report/generateReport', async (data) => {
  const response = await axiosInstance.get(`/report?${formatQuery(data)}`);
  return response.data;
});
