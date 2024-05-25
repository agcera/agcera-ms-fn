import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import { getAllSalesAction, selectAllSales } from '../../redux/salesSlice';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import StyledTable from '../../components/Table/StyledTable';
import MoreButton from '../../components/Table/MoreButton';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { selectLoggedInUser } from '../../redux/usersSlice';
import StatusBadge from '../../components/Table/StatusBadge';

const SalesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);

  const sales = useSelector(selectAllSales);

  useEffect(() => {
    dispatch(getAllSalesAction({}));
  }, [dispatch]);

  const calculateTotal = (sale) => {
    let total = 0;
    sale.variations.forEach((variation) => {
      total += variation.quantity * variation.variation.number * variation.variation.sellingPrice;
    });
    return total;
  };

  const columns = [
    {
      field: 'store',
      headerName: 'Store',
      flex: 1,
      renderCell: (params) => <Box>{params.value?.name || <span className="text-secondary">Deleted Store</span>}</Box>,
    },
    {
      field: 'variations',
      headerName: 'Products',
      flex: 3,
      renderCell: (params) => (
        <Box className="">
          {params.value.map((variations, index) => (
            <Box
              className={`flex mb-2 mt-1 ${index % 2 === 0 ? 'bg-[#E6EEF5]' : 'bg-[#CFCFCF]'}`} // Apply background color dynamically based on index
              key={variations.variation.id}
            >
              <Box className="mr-1">{variations.variation.product.name};</Box>
              <Box className="mr-1">
                <span className="font-semibold">Var:</span> {variations.variation.name};
              </Box>
              <Box className="mr-1"> {variations.quantity} pcs;</Box>
              <Box className="mr-1">
                {variations.quantity * variations.variation.number * variations.variation.sellingPrice} MZN
              </Box>
            </Box>
          ))}
        </Box>
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      renderCell: (params) => <Box>{calculateTotal(params.row)} MZN</Box>,
    },
    {
      field: 'refundedAt',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <StatusBadge
          status={!params.value ? 'Delivered' : format(new Date(params.value), 'd MMM yyyy')}
          bg={!params.value ? 'bg-green-500' : 'bg-red-500'}
          color={'white'}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{format(new Date(params.value), 'd MMM yyyy')}</Box>;
      },
    },
    { field: 'paymentMethod', headerName: 'Payment', flex: 0 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      renderCell: (params) => (
        <MoreButton id={params.id} model={'sales'} className="my-2" hasEdit={false} hasDelete={user.role !== 'user'} />
      ),
    },
  ];

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Sales"
        hasGenerateReport={true}
        hasCreate={user.role === 'keeper' && (() => navigate('/dashboard/sales/create'))}
      />
      <StyledTable
        data={sales}
        columns={columns}
        onRowClick={(sale) => navigate(`/dashboard/sales/${sale.id}`)}
        rowheight={'auto'}
      />
    </Box>
  );
};

export default SalesPage;
