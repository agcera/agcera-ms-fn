import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';
import { formatQuery } from '../utils/formatters';
import { updateStoreAction } from './storesSlice';

const usersAdapter = createEntityAdapter();

export const loginAction = createAsyncThunk('users/loginAction', async ({ phone, password }) => {
  const response = await axiosInstance.post('/users/login', { phone, password });
  localStorage.setItem('AuthTokenExists', true);
  return response.data;
});
export const logoutAction = createAsyncThunk('users/logoutAction', async () => {
  const response = await axiosInstance.post('/users/logout');
  localStorage.removeItem('AuthTokenExists');
  return response.data;
});
export const getUserAction = createAsyncThunk('users/getUserAction', async (id) => {
  // Use 'me' as id to get the logged in user data
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
});
export const forgotPasswordAction = createAsyncThunk('users/forgotPasswordAction', async ({ email }) => {
  const response = await axiosInstance.post(`/users/forgot`, { email });
  return response.data;
});
export const resetPasswordAction = createAsyncThunk('users/resetPasswordAction', async ({ password, token }) => {
  const response = await axiosInstance.put(`/users/reset/${token}`, { password });
  return response.data;
});
export const getAllUsersAction = createAsyncThunk('users/getAllUsersAction', async (query) => {
  const response = await axiosInstance.get(`/users?${formatQuery(query)}`);
  return response.data;
});

export const getAllStoreUsersAction = createAsyncThunk('stores/getAllStoreUsersAction', async ({ storeId, query }) => {
  const response = await axiosInstance.get(`/stores/${storeId}/users?${formatQuery(query)}`);
  return response.data;
});

const { selectAll, selectById } = usersAdapter.getSelectors((state) => state.users);

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    loggedInUserId: null,
  }),
  reducers: {
    // addUser: usersAdapter.addOne,
    // removeUser: usersAdapter.removeOne
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.fulfilled, (state, action) => {
        usersAdapter.upsertOne(state, action.payload.data);
      })
      .addCase(logoutAction.fulfilled, (state) => {
        usersAdapter.removeOne(state, state.loggedInUserId);
        state.loggedInUserId = null;
      })
      .addCase(getUserAction.fulfilled, (state, action) => {
        const user = action.payload.data;
        if (action.meta.arg === 'me') state.loggedInUserId = user.id;
        usersAdapter.upsertOne(state, user);
      })
      .addCase(getAllUsersAction.fulfilled, (state, action) => {
        usersAdapter.upsertMany(state, action.payload.data.users);
      })
      .addCase(getAllStoreUsersAction.fulfilled, (state, action) => {
        usersAdapter.upsertMany(state, action.payload.data.users);
      });

    // Add other reducers not from the usersSlice
    builder.addCase(updateStoreAction.fulfilled, (state, { payload }) => {
      usersAdapter.upsertMany(state, payload.data.updatedUsers);
    });

    return builder;
  },
});

// export const { addUser, removeUser } = usersSlice.actions;

export const selectUserId = (state) => state.users.loggedInUserId;
export const selectUserById = (id) => (state) => selectById(state, id);
export const selectLoggedInUser = (state) => selectById(state, selectUserId(state));
export const selectAllUser = selectAll;
export const selectAllUsersByRole = (role) => {
  return createSelector([selectAll], (users) => {
    if (Array.isArray(role)) {
      return users.filter((user) => role.map((r) => r.toLowerCase()).includes(user.role));
    }
    return users.filter((user) => user.role === role.toLowerCase());
  });
};

export default usersSlice;
