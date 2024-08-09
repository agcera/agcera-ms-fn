import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

export const getAllClientsAction = createAsyncThunk(' clients/getAllClientsAction', async () => {
  const response = await axiosInstance.get('/clients');
  return response.data;
});

const clientAdapter = createEntityAdapter();

const { selectAll } = clientAdapter.getSelectors((state) => state.clients);

const clientSlice = createSlice({
  name: 'clients',
  initialState: clientAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllClientsAction.fulfilled, (state, { payload }) => {
      clientAdapter.upsertMany(state, payload.data);
    });
  },
});

export const selectAllClients = selectAll;
export default clientSlice;
