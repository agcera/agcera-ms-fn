import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import MoreButton from '../../components/Table/MoreButton';
import StatusBadge from '../../components/Table/StatusBadge';
import StyledTable from '../../components/Table/StyledTable';
import { getAllPartialStoresAction, getAllStoresAction, selectAllStores } from '../../redux/storesSlice';

import { Box, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActionButton from '../../components/ActionButton';
import { tokens } from '../../themeConfig';
import { selectLoggedInUser } from '../../redux/usersSlice';

const StoresPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);
  const stores = useSelector(selectAllStores);

  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    dispatch(user.role === 'admin' ? getAllStoresAction() : getAllPartialStoresAction());
  }, [dispatch, user]);

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
      renderCell: (params) => (
        <StatusBadge
          status={params.value ? 'active' : 'inactive'}
          bg={params.value ? 'bg-green-500' : 'bg-red-500'}
          color={'white'}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 1,
      renderCell: (params) => format(new Date(params.value), 'do MMM yyyy'),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
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
        columns={user.role === 'admin' ? columns : miniColumns}
        data={stores}
        onRowClick={user.role === 'admin' && ((row) => navigate(`/dashboard/stores/${row.id}`))}
      />
    </Box>
  );
};

export default StoresPage;
