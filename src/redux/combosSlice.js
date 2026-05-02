import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { formatQuery } from '../utils/formatters';

export const createComboAction = createAsyncThunk('combos/createComboAction', async (data) => {
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

  const response = await axiosInstance.post('/combos', formData);
  return response.data;
});

export const updateComboAction = createAsyncThunk('combos/updateComboAction', async ({ id, data }) => {
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

  const response = await axiosInstance.patch(`/combos/${id}`, formData);
  return response.data;
});

export const getAllCombosAction = createAsyncThunk('combos/getAllCombosAction', async (query) => {
  const response = await axiosInstance.get(`/combos?${formatQuery(query)}`);
  return response.data;
});

export const getComboAction = createAsyncThunk('combos/getComboAction', async (id) => {
  const response = await axiosInstance.get(`/combos/${id}`);
  return response.data;
});

export const deleteComboAction = createAsyncThunk('combos/deleteComboAction', async (id) => {
  const response = await axiosInstance.delete(`/combos/${id}`);
  return response.data;
});

const combosAdapter = createEntityAdapter();
const { selectAll, selectById } = combosAdapter.getSelectors((state) => state.combos);

const combosSlice = createSlice({
  name: 'combos',
  initialState: combosAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComboAction.fulfilled, (state, { payload }) => {
        combosAdapter.upsertOne(state, payload.data);
      })
      .addCase(updateComboAction.fulfilled, (state, { payload }) => {
        combosAdapter.upsertOne(state, payload.data);
      })
      .addCase(getAllCombosAction.fulfilled, (state, { payload }) => {
        combosAdapter.upsertMany(state, payload.data.combos);
      })
      .addCase(getComboAction.fulfilled, (state, { payload }) => {
        combosAdapter.upsertOne(state, payload.data);
      })
      .addCase(deleteComboAction.fulfilled, (state, { meta }) => {
        combosAdapter.removeOne(state, meta.arg);
      });
  },
});

export const selectAllCombos = selectAll;
export const selectComboById = (id) => (state) => selectById(state, id);
export const selectCombosById = (ids = []) =>
  createSelector([selectAllCombos], (combos) => combos.filter((combo) => ids.includes(combo.id)));

export default combosSlice;
