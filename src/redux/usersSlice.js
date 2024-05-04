import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

const userAdapter = createEntityAdapter();

export const loginAction = createAsyncThunk('user/loginAction', async ({ phone, password }) => {
  const response = await axiosInstance.post('/users/login', { phone, password });
  return response.data;
});
export const getUserAction = createAsyncThunk('user/getUserAction', async (id) => {
  // Use 'me' as id to get the logged in user data
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
});
export const forgotPasswordAction = createAsyncThunk('user/forgotPasswordAction', async ({ email }) => {
  const response = await axiosInstance.post(`/users/forgot`, { email });
  return response.data;
});
export const resetPasswordAction = createAsyncThunk('user/resetPasswordAction', async ({ password, token }) => {
  const response = await axiosInstance.put(`/users/reset/${token}`, { password });
  return response.data;
});

export const getAllUsersAction = createAsyncThunk('user/getAllUsersAction', async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
});

const { selectAll, selectById } = userAdapter.getSelectors((state) => state.user);

const userSlice = createSlice({
  name: 'user',
  initialState: userAdapter.getInitialState({
    loggedInUserId: null,
  }),
  reducers: {
    // addUser: userAdapter.addOne,
    // removeUser: userAdapter.removeOne
  },
  extraReducers: (builder) => {
    return builder
      .addCase(loginAction.fulfilled, (state, action) => {
        userAdapter.setOne(state, action.payload.data);
      })
      .addCase(getUserAction.fulfilled, (state, action) => {
        const user = action.payload.data;
        if (action.meta.arg === 'me') state.loggedInUserId = user.id;
        userAdapter.setOne(state, user);
      })
      .addCase(getAllUsersAction.fulfilled, (state, action) => {
        userAdapter.setAll(state, action.payload.data.users);
      });
  },
});

// export const { addUser, removeUser } = userSlice.actions;

export const selectUserId = (state) => state.user.loggedInUserId;
export const selectUserById = (id) => (state) => selectById(state, id);
export const selectAllUser = selectAll;

export default userSlice;
