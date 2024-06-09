import { Box } from '@mui/material';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import MoreButton from '../../components/Table/MoreButton';
import StyledTable from '../../components/Table/StyledTable';
import { getAllDeleted, selectAllDeleted } from '../../redux/deletedSlice';
import ViewTrashModel from './ViewTrashModel';

const TrashPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trash = useSelector(selectAllDeleted);
  const [trashId, setTrashId] = useState(null);
  const [model, setmodel] = useState(null);

  const fetchData = useCallback(
    (query) => {
      if (query?.sort) {
        query.sort = Object.keys(query.sort).reduce((acc, key) => {
          switch (key) {
            case 'deletedBy':
              acc['deletedBy'] = query.sort[key];
              break;
            case 'phone':
              acc['deletedBy'] = query.sort[key];
              break;
            default:
              acc[key] = query.sort[key];
          }
          return acc;
        }, {});
      }
      return dispatch(getAllDeleted(query));
    },
    [dispatch]
  );

  const columns = [
    {
      field: 'table',
      headerName: 'Deleted Item',
      flex: 1,
    },
    {
      field: 'deletedBy',
      headerName: 'Deleted By',
      flex: 1,
      valueGetter: (params, row) => {
        const user = JSON.parse(row.deletedBy);
        return user.name;
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      valueGetter: (params, row) => {
        const user = JSON.parse(row.deletedBy);
        return user.phone;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Done At',
      flex: 1,
      valueGetter: (params, row) => format(new Date(row.createdAt), 'do MMM yyyy'),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      sortable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <MoreButton
            hasEdit={false}
            hasDetails={() => {
              const table = params.row.table;
              table === 'product' ? setmodel('product') || setTrashId(params.id) : null;
              table === 'sale' && navigate(`/dashboard/trash/${params.id}`);
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
      <PageHeader title="Trash" hasGenerateReport={true} />

      <StyledTable fetchData={fetchData} columns={columns} data={trash} getRowId={(row) => row.id} />

      {!!trashId && <ViewTrashModel id={trashId} open={!!trashId} handleClose={handleCloseDetails} model={model} />}
    </Box>
  );
};

export default TrashPage;
