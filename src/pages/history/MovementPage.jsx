import { Box, capitalize } from '@mui/material';
import { format } from 'date-fns';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import StyledTable from '../../components/Table/StyledTable';
import { getAllMovements, selectAllMovements } from '../../redux/historySlice';

const MovementPage = () => {
  const dispatch = useDispatch();
  const movements = useSelector(selectAllMovements);

  console.log(movements, 'movements');
  // get all stores and keep in state of stores

  // include also the storeId int he query
  const fetchData = useCallback(
    (query) => {
      if (query?.sort) {
        query.sort = Object.keys(query.sort).reduce((acc, key) => {
          switch (key) {
            case 'product':
              acc['product.name'] = query.sort[key];
              break;
            case 'storeFrom':
              acc['storeFrom.name'] = query.sort[key];
              break;
            case 'storeTo':
              acc['storeTo.name'] = query.sort[key];
              break;
            case 'user':
              acc['user.name'] = query.sort[key];
              break;
            default:
              acc[key] = query.sort[key];
          }
          return acc;
        }, {});
      }
      return dispatch(getAllMovements({ ...query }));
    },
    [dispatch]
  );

  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      flex: 0,
      valueGetter: (params, row) => row.product?.name,
    },
    { field: 'quantity', headerName: 'Quantity', flex: 0 },
    {
      field: 'storeFrom',
      headerName: 'Origin',
      flex: 1,
      valueGetter: (params, row) => (row.storeFrom?.name ? capitalize(row.storeFrom.name) : 'Deleted Store'),
      renderCell: (params) =>
        params.row.storeFrom?.name ? (
          capitalize(params.row.storeFrom.name)
        ) : (
          <span className="text-secondary">Deleted Store</span>
        ),
    },

    {
      field: 'storeTo',
      headerName: 'destination',
      flex: 1,
      valueGetter: (params, row) => (row.storeTo?.name ? capitalize(row.storeTo.name) : 'Deleted Store'),
      renderCell: (params) =>
        params.row.storeTo?.name ? (
          capitalize(params.row.storeTo.name)
        ) : (
          <span className="text-secondary">Deleted Store</span>
        ),
    },
    {
      field: 'user',
      headerName: 'Moved By',
      flex: 1,
      valueGetter: (params, row) => (row.user?.name ? capitalize(row.user.name) : 'Deleted User'),
      renderCell: (params) =>
        params.row.user?.name ? capitalize(params.row.user.name) : <span className="text-secondary">Deleted User</span>,
    },

    {
      field: 'createdAt',
      headerName: 'Done At',
      flex: 1,
      valueGetter: (params, row) => format(new Date(row.createdAt), 'do MMM yyyy h:mm a'),
    },
  ];

  return (
    <Box className="size-full flex flex-col">
      <PageHeader title="Moved Products" hasGenerateReport={true} hasBack={true} />

      <StyledTable
        disableSearch={true}
        fetchData={fetchData}
        columns={columns}
        data={movements}
        getRowId={(row) => row.id}
        enableStoreSelector={true}
      />
    </Box>
  );
};
export default MovementPage;
