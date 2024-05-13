import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import { getAllStoresAction, selectAllStores } from '../../redux/storesSlice';
import StyledTable from '../../components/Table/StyledTable';
import StatusBadge from '../../components/Table/StatusBadge';
import MoreButton from '../../components/Table/MoreButton';

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const StoresPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stores = useSelector(selectAllStores);

  useEffect(() => {
    dispatch(getAllStoresAction({}));
  }, [dispatch]);

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
        hasCreate={() => {
          navigate('/dashboard/stores/create');
        }}
      />

      <StyledTable
        columns={columns}
        data={stores}
        onRowClick={(row) => {
          navigate(`/dashboard/stores/${row.id}`);
        }}
      />
    </Box>
  );
};

export default StoresPage;
