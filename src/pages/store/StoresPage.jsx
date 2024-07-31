import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import MoreButton from '../../components/Table/MoreButton';
import StatusBadge from '../../components/Table/StatusBadge';
import StyledTable from '../../components/Table/StyledTable';
import { getAllPartialStoresAction, getAllStoresAction, selectAllStores } from '../../redux/storesSlice';

import { Box, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActionButton from '../../components/ActionButton';
import { selectLoggedInUser } from '../../redux/usersSlice';
import { tokens } from '../../themeConfig';

const StoresPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);
  const stores = useSelector(selectAllStores);

  const colors = tokens(theme.palette.mode);

  const fetchData = useCallback(
    (query) => dispatch(user.role === 'admin' ? getAllStoresAction(query) : getAllPartialStoresAction()),
    [user.role, dispatch]
  );

  const miniColumns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
  ];
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
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
      valueGetter: (params, row) => format(new Date(row.createdAt), 'do MMM yyyy h:mm a'),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      disableExport: true,
      sortable: false,
      renderCell: (params) => {
        let hasDelete = true;
        if (['main', 'expired'].includes(params.row.name.toLowerCase())) hasDelete = false;
        return <MoreButton id={params.id} model={'stores'} hasDelete={hasDelete} />;
      },
    },
  ];

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Stores"
        hasGenerateReport={true}
        hasCreate={
          user.role === 'admin' &&
          (() => {
            navigate('/dashboard/stores/create');
          })
        }
        otherActions={
          user.role === 'admin' && [
            <ActionButton
              key="0"
              LinkComponent={Link}
              to="/dashboard/stores/add-product"
              bg={colors.blue.main}
              color={colors.text_dark.main}
              content="Add/Move products"
            />,
          ]
        }
      />

      <StyledTable
        fetchData={fetchData}
        columns={user.role === 'admin' ? columns : miniColumns}
        data={stores}
        onRowClick={user.role === 'admin' && ((row) => navigate(`/dashboard/stores/${row.id}`))}
      />
    </Box>
  );
};

export default StoresPage;
