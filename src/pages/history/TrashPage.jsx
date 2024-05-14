import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PageHeader from '../../components/PageHeader';

import { format } from 'date-fns';
import StyledTable from '../../components/Table/StyledTable';
import { getAllDeleted, selectAllDeleted } from '../../redux/deletedSlice';

const TrashPage = () => {
  /* eslint-disable no-unused-vars */
  // const [loading, setLoading] = useState(false);

  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const trash = useSelector(selectAllDeleted);

  console.log(trash, 'trash mvementsjdkfsdkfjskldfsf');

  useEffect(() => {
    dispatch(getAllDeleted({}));
  }, [dispatch]);

  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      flex: 0,
      renderCell: (params) => params.value.name,
    },
    { field: 'storeFrom', headerName: 'Origin', flex: 1, renderCell: (params) => params.value.name },

    { field: 'storeTo', headerName: 'destination', flex: 1, renderCell: (params) => params.value.name },
    { field: 'user', headerName: 'Moved By', flex: 1, renderCell: (params) => params.value.name },

    {
      field: 'CreatedAt',
      headerName: 'Done At',
      flex: 1,
      renderCell: (params) => format(new Date(params.value), 'do MMM yyyy'),
    },
  ];

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Trash"
        hasGenerateReport={true}
        hasCreate={() => {
          console.log('Create user');
        }}
      />

      <StyledTable columns={columns} data={trash} getRowId={(row) => row.id} />
    </Box>
  );
};

export default TrashPage;
