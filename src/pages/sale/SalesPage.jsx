import { Box, Tooltip, Typography } from '@mui/material';
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
          type: 'variation',
          id: variation.variation.id,
          name: variation.variation.product.name,
          label: `Var: ${variation.variation.name} (${variation.variation.number})`,
          quantity: variation.quantity,
          total: variation.quantity * variation.variation.sellingPrice,
        }));
        const mixtureRows = (params.row.mixtures || []).flatMap((mixture) => {
          const items = mixture.mixture?.items || [];
          if (!items.length) {
            return [
              {
                type: 'mixture',
                id: mixture.mixture.id,
                name: mixture.mixture.name,
                label: 'Mixture',
                quantity: mixture.quantity,
                total: mixture.quantity * mixture.mixture.sellingPrice,
              },
            ];
          }

          return items.map((item, index) => {
            const product = item.product;
            const unitPrice = product?.variations?.[0]?.sellingPrice || 0;
            const quantity = mixture.quantity * (item.number || 0);
            return {
              type: 'mixture',
              id: `${mixture.mixture.id}-${product?.id || index}`,
              name: product?.name || 'Product',
              label: `Mixture: ${mixture.mixture.name}`,
              quantity,
              total: quantity * unitPrice,
            };
          });
        });
        const rows = [...variationRows, ...mixtureRows];

        return (
          <Box className="w-full">
            {rows.map((row, index) => (
              <Box className={`flex flex-wrap mt-1 ${index % 2 === 0 ? 'bg-[#E6EEF5]' : 'bg-[#CFCFCF]'}`} key={row.id}>
                <Box className="mr-0.5">{row.name};</Box>
                <Box className="mr-0.5">
                  <span className="font-semibold">{row.label}</span>;
                </Box>
                <Box className="mr-0.5"> {row.quantity} pcs;</Box>
                {row.type === 'variation' && <Box className="mr-0.5">{row.total} MZN</Box>}
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
      renderCell: (params) => {
        let statusBgColor;
        if (params.row.refundedAt) {
          statusBgColor = 'bg-red-500';
        } else if (params.row.checkedAt) {
          statusBgColor = 'bg-gray-200';
        } else {
          statusBgColor = 'bg-green-500';
        }

        return (
          <Tooltip
            title={params.row.refundedAt ? 'Refunded' : params.row.checkedAt ? 'Collected' : 'Delivered'}
            placement="top"
            disableInteractive
            arrow
          >
            <div>
              <StatusBadge status={params.value} bg={statusBgColor} color={'white'} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      valueGetter: (params, row) => format(new Date(row.createdAt), 'do MMM yyyy h:mm a'),
    },
    {
      field: 'payments',
      headerName: 'Payment',
      flex: 2,
      sortable: false,
      valueGetter: (params, row) =>
        (row.payments || []).length
          ? row.payments.map((payment) => `${payment.paymentMethod} (${payment.amount} MZN)`)
          : 'N/A',
      renderCell: (params) => {
        return (
          <div className="w-full">
            {params.row.payments?.map((payment) => (
              <Typography variant="body2" key={payment.id}>
                {payment.paymentMethod} ({payment.amount} MZN)
              </Typography>
            )) || <Typography variant="body2">N/A</Typography>}
          </div>
        );
      },
    },
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
