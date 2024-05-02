import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../axios';

const userAdapter = createEntityAdapter();

export const loginAction = createAsyncThunk('user/login', async ({ phone, password }) => {
  try {
    const response = await axiosInstance.post('/users/login', { phone, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data?.message || error.message);
  }
});

export const getAllUsersAction = createAsyncThunk('user/getAllUsers', async () => {
  const response = await axiosInstance.get('/users');
  const data = await response.json();
  return data;
});

export const { selectAll: getAllUsers, selectById: getUserById } = userAdapter.getSelectors((state) => state.user);

const userSlice = createSlice({
  name: 'user',
  initialState: userAdapter.getInitialState(),
  reducers: {
    // addUser: userAdapter.addOne,
    // removeUser: userAdapter.removeOne
  },
  extraReducers: (builder) => {
    return builder.addCase(loginAction.fulfilled, (state, action) => {
      userAdapter.setOne(state, action.payload.data);
    });
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice;
