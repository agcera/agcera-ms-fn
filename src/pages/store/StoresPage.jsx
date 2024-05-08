import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import { getAllStoresAction, selectAllStores } from '../../redux/storesSlice';
import StyledTable from '../../components/Table/StyledTable';
import StatusBadge from '../../components/Table/StatusBadge';
import MoreButton from '../../components/Table/MoreButton';

import { useEffect } from 'react';
import { Box } from '@mui/material';

const StoresPage = () => {
  const dispatch = useDispatch();
  const stores = useSelector(selectAllStores);
  // console.log(stores, '  storessssss');

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
      flex: 1,
      renderCell: (params) => (
        <StatusBadge
          status={params.value ? 'active' : 'inactive'}
          bg={params.value ? 'bg-green-500' : 'bg-red-500'}
          color={'white'}
        />
      ),
    },
    {
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => <MoreButton id={params.id} model={'store'} />,
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Stores"
        hasGenerateReport={() => {
          console.log('Generate Report of stores');
        }}
        hasCreate={() => {
          console.log('Create stores');
        }}
      />

      <StyledTable columns={columns} data={stores} />
    </Box>
  );
};

export default StoresPage;
