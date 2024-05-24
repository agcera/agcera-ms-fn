import { Box, capitalize } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PageHeader from '../../components/PageHeader';

import { format } from 'date-fns';
import StyledTable from '../../components/Table/StyledTable';
import { getAllMovements, selectAllMovements } from '../../redux/historySlice';

const MovementPage = () => {
  /* eslint-disable no-unused-vars */
  // const [loading, setLoading] = useState(false);

  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const movements = useSelector(selectAllMovements);

  console.log(movements, 'mvementsjdkfsdkfjskldfsf');

  useEffect(() => {
    dispatch(getAllMovements({}));
  }, [dispatch]);

  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      flex: 0,
      renderCell: (params) => params.value.name,
    },
    { field: 'quantity', headerName: 'Quantity', flex: 0 },
    {
      field: 'storeFrom',
      headerName: 'Origin',
      flex: 1,
      renderCell: (params) =>
        params.value ? capitalize(params.value.name) : <span className="text-secondary">Deleted Store</span>,
    },

    {
      field: 'storeTo',
      headerName: 'destination',
      flex: 1,
      renderCell: (params) =>
        params.value ? capitalize(params.value.name) : <span className="text-secondary">Deleted Store</span>,
    },
    {
      field: 'user',
      headerName: 'Moved By',
      flex: 1,
      renderCell: (params) =>
        params.value ? capitalize(params.value.name) : <span className="text-secondary">Deleted User</span>,
    },

    {
      field: 'createdAt',
      headerName: 'Done At',
      flex: 1,
      renderCell: (params) => format(new Date(params.value), 'do MMM yyyy'),
    },
  ];

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Moved Products"
        hasGenerateReport={true}
        hasBack={true}
        hasCreate={() => {
          console.log('Create user');
        }}
      />

      <StyledTable columns={columns} data={movements} getRowId={(row) => row.id} />
    </Box>
  );
};
export default MovementPage;
