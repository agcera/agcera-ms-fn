import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

export const createProductAction = createAsyncThunk(
  'products/createProductAction',
  async ({ name, type, variations, image }) => {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('type', type);
    formData.append('image', image, image.name);

    variations.forEach(({ name, description, costPrice, sellingPrice }, index) => {
      formData.append(`variations[${index}][name]`, name);
      formData.append(`variations[${index}][costPrice]`, costPrice);
      formData.append(`variations[${index}][sellingPrice]`, sellingPrice);
      description && formData.append(`variations[${index}][description]`, description);
    });
    const response = await axiosInstance.post('/products', formData);
    return response.data;
  }
);
export const getAllProductsAction = createAsyncThunk('products/getAllProductsAction', async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
});

const productsAdapter = createEntityAdapter();

const { selectAll, selectById } = productsAdapter.getSelectors((state) => state.products);

const productsSlice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProductAction.fulfilled, (state, { payload }) => {
        productsAdapter.setOne(state, payload.data);
      })
      .addCase(getAllProductsAction.fulfilled, (state, { payload }) => {
        productsAdapter.setAll(state, payload.data);
      });
  },
});

export const selectAllProducts = selectAll;
export const selectProductById = (id) => (state) => selectById(state, id);

export default productsSlice;
