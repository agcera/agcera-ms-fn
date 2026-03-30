import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { formatQuery } from '../utils/formatters';

export const createMixtureAction = createAsyncThunk('mixtures/createMixtureAction', async (data) => {
  const { name, costPrice, sellingPrice, image, description, items } = data;
  const formData = new FormData();

  formData.append('name', name);
  formData.append('costPrice', costPrice);
  formData.append('sellingPrice', sellingPrice);
  description !== undefined && formData.append('description', description ?? '');
  image && formData.append('image', image, image.name);

  (items || []).forEach(({ productId, number }, index) => {
    formData.append(`items[${index}][productId]`, productId);
    formData.append(`items[${index}][number]`, number);
  });

  const response = await axiosInstance.post('/mixtures', formData);
  return response.data;
});

export const updateMixtureAction = createAsyncThunk('mixtures/updateMixtureAction', async ({ id, data }) => {
  const { name, costPrice, sellingPrice, image, description, items } = data;
  const formData = new FormData();

  name && formData.append('name', name);
  costPrice !== undefined && formData.append('costPrice', costPrice);
  sellingPrice !== undefined && formData.append('sellingPrice', sellingPrice);
  description !== undefined && formData.append('description', description ?? '');
  image && formData.append('image', image, image.name);

  (items || []).forEach(({ productId, number }, index) => {
    formData.append(`items[${index}][productId]`, productId);
    formData.append(`items[${index}][number]`, number);
  });

  const response = await axiosInstance.patch(`/mixtures/${id}`, formData);
  return response.data;
});

export const getAllMixturesAction = createAsyncThunk('mixtures/getAllMixturesAction', async (query) => {
  const response = await axiosInstance.get(`/mixtures?${formatQuery(query)}`);
  return response.data;
});

export const getMixtureAction = createAsyncThunk('mixtures/getMixtureAction', async (id) => {
  const response = await axiosInstance.get(`/mixtures/${id}`);
  return response.data;
});

export const deleteMixtureAction = createAsyncThunk('mixtures/deleteMixtureAction', async (id) => {
  const response = await axiosInstance.delete(`/mixtures/${id}`);
  return response.data;
});

const mixturesAdapter = createEntityAdapter();
const { selectAll, selectById } = mixturesAdapter.getSelectors((state) => state.mixtures);

const mixturesSlice = createSlice({
  name: 'mixtures',
  initialState: mixturesAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMixtureAction.fulfilled, (state, { payload }) => {
        mixturesAdapter.upsertOne(state, payload.data);
      })
      .addCase(updateMixtureAction.fulfilled, (state, { payload }) => {
        mixturesAdapter.upsertOne(state, payload.data);
      })
      .addCase(getAllMixturesAction.fulfilled, (state, { payload }) => {
        mixturesAdapter.upsertMany(state, payload.data.mixtures);
      })
      .addCase(getMixtureAction.fulfilled, (state, { payload }) => {
        mixturesAdapter.upsertOne(state, payload.data);
      })
      .addCase(deleteMixtureAction.fulfilled, (state, { meta }) => {
        mixturesAdapter.removeOne(state, meta.arg);
      });
  },
});

export const selectAllMixtures = selectAll;
export const selectMixtureById = (id) => (state) => selectById(state, id);
export const selectMixturesById = (ids = []) =>
  createSelector([selectAllMixtures], (mixtures) => mixtures.filter((mixture) => ids.includes(mixture.id)));

export default mixturesSlice;
