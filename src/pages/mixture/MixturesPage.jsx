import { Box } from '@mui/material';
import { format } from 'date-fns';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import MoreButton from '../../components/Table/MoreButton';
import StyledTable from '../../components/Table/StyledTable';
import ZoomableImage from '../../components/ZoomableImage';
import { getAllMixturesAction, selectAllMixtures } from '../../redux/mixturesSlice';
import { selectLoggedInUser } from '../../redux/usersSlice';

const MixturesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mixtures = useSelector(selectAllMixtures);
  const user = useSelector(selectLoggedInUser);
  const isAdmin = user.role === 'admin';

  const fetchData = useCallback(
    (query) => {
      if (query?.sort) {
        query.sort = Object.keys(query.sort).reduce((acc, key) => {
          switch (key) {
            case 'items':
              acc['items.product.name'] = query.sort[key];
            case 'sellingPrice':
              acc['sellingPrice'] = query.sort[key];
              break;
            case 'costPrice':
              acc['costPrice'] = query.sort[key];
              break;
            default:
              acc[key] = query.sort[key];
          }
          return acc;
        }, {});
      }
      return dispatch(getAllMixturesAction(query));
    },
    [dispatch]
  );

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      flex: 0,
      disableExport: true,
      renderCell: (params) => <ZoomableImage image={params.value} />,
    },
    { field: 'name', headerName: 'Name' },
    {
      field: 'items',
      headerName: 'Items',
      flex: 2,
      valueGetter: (params, row) => row.items?.length || 0,
      renderCell: (params) => {
        const items = params.row?.items || params.row?.MixtureItems || [];
        if (!items.length) return '0';

        const rows = items.map((item, index) => {
          const product = item.product || item.Product;
          const quantity = item.number ?? item.quantity ?? 0;

          return {
            id: item.id || product?.id || `${index}`,
            name: product?.name || 'Product',
            quantity,
          };
        });

        return (
          <Box className="w-full">
            {rows.map((row, index) => (
              <Box
                className={`flex flex-wrap mt-1 ${index % 2 === 0 ? 'bg-[#E6EEF5]' : 'bg-[#CFCFCF]'}`}
                key={`${row.id}-${index}`}
              >
                <Box className="mr-0.5">{row.name};</Box>
                <Box className="mr-0.5"> {row.quantity} pcs;</Box>
              </Box>
            ))}
          </Box>
        );
      },
    },
    isAdmin && {
      field: 'costPrice',
      headerName: 'Cost Price',
      flex: 1,
      valueGetter: (params, row) => `${row.costPrice} MZN`,
    },
    {
      field: 'sellingPrice',
      headerName: 'Selling Price',
      flex: 1,
      valueGetter: (params, row) => `${row.sellingPrice} MZN`,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 1.5,
      valueGetter: (params, row) => (row.createdAt ? format(new Date(row.createdAt), 'do MMM yyyy h:mm a') : 'N/a'),
    },
  ].filter(Boolean);

  if (isAdmin) {
    columns.push({
      field: 'action',
      headerName: 'Action',
      flex: 0,
      disableExport: true,
      sortable: false,
      renderCell: (params) => <MoreButton id={params.id} model={'mixtures'} hasDetails={false} hasDelete={true} />,
    });
  }

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Mixtures"
        hasCreate={!isAdmin ? false : () => navigate('/dashboard/mixtures/create')}
        hasGenerateReport={true}
      />
      <StyledTable fetchData={fetchData} columns={columns} data={mixtures} rowheight={'auto'} />
    </Box>
  );
};

export default MixturesPage;
