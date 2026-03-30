import { Box, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import MoreButton from '../../components/Table/MoreButton';
import StatusBadge from '../../components/Table/StatusBadge';
import StyledTable from '../../components/Table/StyledTable';
import { getAllSalesAction, selectAllSales } from '../../redux/salesSlice';
import { selectLoggedInUser } from '../../redux/usersSlice';
import { calculateProfit, calculateTotal } from '../../utils/sales.utils';

const SalesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);

  const sales = useSelector(selectAllSales);

  const fetchData = useCallback(
    (query) => {
      if (query) {
        if (query?.sort) {
          query.sort = Object.keys(query.sort).reduce((acc, key) => {
            switch (key) {
              case 'store':
                acc['store.name'] = query.sort[key];
                break;
              default:
                acc[key] = query.sort[key];
            }
            return acc;
          }, {});
        }

        if (query?.search) {
          query.clientPhone = encodeURIComponent(query.search);
          delete query.search;
        }
      }

      return dispatch(getAllSalesAction(query));
    },
    [dispatch]
  );

  // const fetchData = useCallback(
  //   (query) => {
  //     return dispatch(getAllUsersAction(query));
  //   },
  //   [dispatch]
  // );

  const columns = [
    {
      field: 'store',
      headerName: 'Store',
      flex: 1,
      valueGetter: (params, row) => row.store?.name || 'Deleted Store',
      renderCell: (params) => (
        <Box>{params.row.store?.name || <span className="text-secondary">Deleted Store</span>}</Box>
      ),
    },
    {
      field: 'variations',
      headerName: 'Products',
      flex: 3,
      sortable: false,
      disableExport: true,
      renderCell: (params) => {
        const variationRows = (params.row.variations || []).map((variation) => ({
          id: variation.variation.id,
          name: variation.variation.product.name,
          label: `Var: ${variation.variation.name}`,
          quantity: variation.quantity,
          total: variation.quantity * variation.variation.sellingPrice,
        }));
        const mixtureRows = (params.row.mixtures || []).map((mixture) => ({
          id: mixture.mixture.id,
          name: mixture.mixture.name,
          label: 'Mixture',
          quantity: mixture.quantity,
          total: mixture.quantity * mixture.mixture.sellingPrice,
        }));
        const rows = [...variationRows, ...mixtureRows];

        return (
          <Box className="w-full">
            {rows.map((row, index) => (
              <Box className={`flex mt-1 ${index % 2 === 0 ? 'bg-[#E6EEF5]' : 'bg-[#CFCFCF]'}`} key={row.id}>
                <Box className="mr-1">{row.name};</Box>
                <Box className="mr-1">
                  <span className="font-semibold">{row.label}</span>;
                </Box>
                <Box className="mr-1"> {row.quantity} pcs;</Box>
                <Box className="mr-1">{row.total} MZN</Box>
              </Box>
            ))}
          </Box>
        );
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      sortable: false,
      align: 'left',
      valueGetter: (params, row) => `${calculateTotal(row)} MZN`,
    },
    user.role === 'admin' && {
      field: 'profit',
      headerName: 'profit',
      flex: 1,
      sortable: false,
      valueGetter: (params, row) => `${calculateProfit(row)} MZN`,
    },
    {
      field: 'refundedAt',
      headerName: 'Status',
      flex: 1,
      valueGetter: (params, row) =>
        !row.refundedAt && !row.checkedAt
          ? 'Delivered'
          : format(new Date(row.checkedAt || row.refundedAt), 'd MMM yyyy'),
      renderCell: (params) => (
        <Tooltip
          title={params.row.refundedAt ? 'Refunded' : params.row.checkedAt ? 'Collected' : 'Delivered'}
          placement="top"
          disableInteractive
          arrow
        >
          <div>
            <StatusBadge
              status={params.value}
              bg={params.row.checkedAt ? 'bg-gray-200' : params.value === 'Delivered' ? 'bg-green-500' : 'bg-red-500'}
              color={'white'}
            />
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      valueGetter: (params, row) => format(new Date(row.createdAt), 'do MMM yyyy h:mm a'),
    },
    { field: 'paymentMethod', headerName: 'Payment', flex: 0 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      disableExport: true,
      sortable: false,
      renderCell: (params) => (
        <MoreButton id={params.id} model={'sales'} className="my-2" hasEdit={false} hasRefund={true} />
      ),
    },
  ].filter(Boolean);

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Sales"
        hasGenerateReport={true}
        hasCreate={user.role === 'keeper' && (() => navigate('/dashboard/sales/create'))}
      />
      <StyledTable
        enableStoreSelector={user.role === 'admin'}
        disableSearch={false}
        fetchData={fetchData}
        data={sales}
        columns={columns}
        onRowClick={(sale) => navigate(`/dashboard/sales/${sale.id}`)}
        rowheight={'auto'}
      />
    </Box>
  );
};

export default SalesPage;
