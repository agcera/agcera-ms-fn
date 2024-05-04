import PageHeader from '../components/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
// import {toast} from 'react-toastify';
import { selectAllUser } from '../redux/users/userSlice';
import { getAllUsersAction } from '../redux/users/userSlice';
import { Box } from '@mui/material';

const UsersPage = () => {
  /* eslint-disable no-unused-vars */
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const users = useSelector(selectAllUser);

  console.log(users, '_______________________________');

  useEffect(() => {
    dispatch(getAllUsersAction({}));
  }, [dispatch]);

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },

    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'actions', headerName: 'Actions', flex: 1 },
  ];

  return (
    <Box className="w-full h-full overflow-auto">
      <PageHeader
        title="USERS"
        hasGenerateReport={() => {
          console.log('Generate Report of users');
        }}
        hasCreate={() => {
          console.log('Create user');
        }}
      />

      <DataGrid
        className="overflow-x-auto"
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};
export default UsersPage;
