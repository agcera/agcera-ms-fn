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
    const response = await axiosInstance.post(`/products`, formData);
    return response.data;
  }
);
export const updateProductAction = createAsyncThunk('products/updateProductAction', async ({ id, data }) => {
  const { name, image, variations } = data;
  const formData = new FormData();

  name && formData.append('name', name);
  image && formData.append('image', image, image.name);

  variations?.forEach(({ name, description, costPrice = null, sellingPrice = null }, index) => {
    name && formData.append(`variations[${index}][name]`, name);
    costPrice !== null && formData.append(`variations[${index}][costPrice]`, costPrice);
    sellingPrice !== null && formData.append(`variations[${index}][sellingPrice]`, sellingPrice);
    description && formData.append(`variations[${index}][description]`, description);
  });
  const response = await axiosInstance.patch(`/products/${id}`, formData);
  return response.data;
});
export const getAllProductsAction = createAsyncThunk('products/getAllProductsAction', async () => {
  const response = await axiosInstance.get(`/products`);
  return response.data;
});
export const getProductAction = createAsyncThunk('products/getOneProductAction', async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
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
        // console.log(payload.data.products, 'frm paylodddd   kkk')
        productsAdapter.setAll(state, payload.data.products);
      })
      .addCase(getProductAction.fulfilled, (state, { payload }) => {
        productsAdapter.setOne(state, payload.data);
      });
  },
});

export const selectAllProducts = selectAll;
export const selectProductById = (id) => (state) => selectById(state, id);

export default productsSlice;
