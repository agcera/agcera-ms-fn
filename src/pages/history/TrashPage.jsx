import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PageHeader from '../../components/PageHeader';

import { format } from 'date-fns';
import StyledTable from '../../components/Table/StyledTable';
import { getAllDeleted, selectAllDeleted } from '../../redux/deletedSlice';
import MoreButton from '../../components/Table/MoreButton';
import ViewTrashModel from './ViewTrashModel';
import { useNavigate } from 'react-router-dom';

const TrashPage = () => {
  /* eslint-disable no-unused-vars */
  // const [loading, setLoading] = useState(false);

  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const trash = useSelector(selectAllDeleted);

  console.log(trash, 'trash mvementsjdkfsdkfjskldfsf');
  const [trashId, setTrashId] = useState(null);
  const [model, setmodel] = useState(null);

  useEffect(() => {
    dispatch(getAllDeleted({}));
  }, [dispatch]);

  const columns = [
    {
      field: 'table',
      headerName: 'Deleted Item',
      flex: 1,
    },
    {
      field: 'userId',
      headerName: 'Deleted By',
      flex: 2,
      renderCell: (params) => {
        return params.value;
      },
    },

    {
      field: 'createdAt',
      headerName: 'Done At',
      flex: 1,
      renderCell: (params) => format(new Date(params.value), 'do MMM yyyy'),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      renderCell: (params) => {
        return (
          <MoreButton
            hasEdit={false}
            hasDetails={() => {
              const table = params.row.table;
              console.log(table, 'table');
              table === 'product' ? setmodel('product') || setTrashId(params.id) : null;
              table === 'sale' && navigate(`/dashboard/history/trash/${params.id}`);
              table === 'user' ? setmodel('user') || setTrashId(params.id) : null;
              table === 'store' ? setmodel('store') || setTrashId(params.id) : null;
            }}
          />
        );
      },
    },
  ];

  const handleCloseDetails = () => {
    setTrashId(null);
  };

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

      {!!trashId && <ViewTrashModel id={trashId} open={!!trashId} handleClose={handleCloseDetails} model={model} />}
    </Box>
  );
};

export default TrashPage;
