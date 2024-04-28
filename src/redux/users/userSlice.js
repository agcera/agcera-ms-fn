import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../axios';

const userAdapter = createEntityAdapter();

export const getAllUsersAction = createAsyncThunk('user/getAllUsers', async () => {
  // const response = await fetch("https://jsonplaceholder.typicode.com/users")
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
    return builder
      .addCase(getAllUsersAction.pending, () => {
        console.log('pending');
      })
      .addCase(getAllUsersAction.fulfilled, userAdapter.upsertMany);
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice;
