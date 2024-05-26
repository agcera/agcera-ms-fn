import { Box } from '@mui/material';
import { format } from 'date-fns';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import MoreButton from '../../components/Table/MoreButton';
import StatusBadge from '../../components/Table/StatusBadge';
import StyledTable from '../../components/Table/StyledTable';
import { getAllUsersAction, selectAllUser, selectLoggedInUser } from '../../redux/usersSlice';

const UsersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const users = useSelector(selectAllUser);

  const fetchData = useCallback(
    (query) => {
      return dispatch(getAllUsersAction(query));
    },
    [dispatch]
  );

  const columns = [
    {
      field: 'image',
      headerName: 'Avatar',
      flex: 0,
      disableExport: true,
      renderCell: (params) => (
        <Box className="h-full aspect-square p-1">
          <img src={params.value} alt="avatar" className="w-full h-full rounded-full object-cover bg-slate-300" />
        </Box>
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0,
      valueGetter: (params, row) => (row.isActive ? 'Active' : 'InActive'),
      renderCell: (params) => (
        <StatusBadge
          status={params.value}
          bg={params.value === 'Active' ? 'bg-green-500' : 'bg-red-500'}
          color={'white'}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 1,
      valueGetter: (params, row) => format(new Date(row.createdAt), 'do MMM yyyy'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0,
      disableExport: true,
      sortable: false,
      renderCell: (params) => (
        <MoreButton
          id={params.id}
          model={'users'}
          hasEdit={user.role !== 'keeper'}
          hasDelete={user.role !== 'keeper'}
        />
      ),
    },
  ];

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Users"
        hasGenerateReport={true}
        hasCreate={user.role !== 'user' && (() => navigate('/dashboard/users/create'))}
      />

      <StyledTable
        fetchData={fetchData}
        columns={columns}
        data={users}
        onRowClick={(user) => navigate(`/dashboard/users/${user.id}`)}
      />
    </Box>
  );
};
export default UsersPage;
