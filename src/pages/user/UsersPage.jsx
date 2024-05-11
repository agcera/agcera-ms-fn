import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PageHeader from '../../components/PageHeader';

import { getAllUsersAction, selectAllUser } from '../../redux/usersSlice';
import { tokens } from '../../themeConfig';
import StyledTable from '../../components/Table/StyledTable';
import MoreButton from '../../components/Table/MoreButton';
import StatusBadge from '../../components/Table/StatusBadge';

const UsersPage = () => {
  /* eslint-disable no-unused-vars */
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const users = useSelector(selectAllUser);

  useEffect(() => {
    dispatch(getAllUsersAction({}));
  }, [dispatch]);

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },

    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0,
      renderCell: (params) => (
        <StatusBadge
          status={params.value ? 'active' : 'inactive'}
          bg={params.value ? 'bg-green-500' : 'bg-red-500'}
          color={'white'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0,
      renderCell: (params) => <MoreButton id={params.id} model={'user'} />,
    },
  ];

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Users"
        hasGenerateReport={() => {
          console.log('Generate Report of users');
        }}
        hasCreate={() => {
          console.log('Create user');
        }}
      />

      <StyledTable columns={columns} data={users} />
    </Box>
  );
};
export default UsersPage;
