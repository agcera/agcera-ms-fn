import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import { getAllSalesAction, selectAllSales } from '../../redux/salesSlice';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import StyledTable from '../../components/Table/StyledTable';
import MoreButton from '../../components/Table/MoreButton';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const SalesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sales = useSelector(selectAllSales);

  useEffect(() => {
    dispatch(getAllSalesAction({}));
  }, [dispatch]);

  const calculateTotal = (sale) => {
    let total = 0;
    sale.variations.forEach((variation) => {
      total += variation.quantity * variation.variation.sellingPrice;
    });
    return total;
  };

  const columns = [
    {
      field: 'store',
      headerName: 'Store',
      flex: 1,
      renderCell: (params) => <Box>{params.value.name}</Box>,
    },
    {
      field: 'variations',
      headerName: 'Products',
      flex: 3,
      renderCell: (params) => (
        <Box className="">
          {params.value.map((product, index) => (
            <Box
              className={`flex mb-2 mt-1 ${index % 2 === 0 ? 'bg-[#E6EEF5]' : 'bg-[#CFCFCF]'}`} // Apply background color dynamically based on index
              key={product.variation.id}
            >
              <Box className="mr-1">{product.variation.product.name};</Box>
              <Box className="mr-1">
                <span className="font-semibold">Var:</span> {product.variation.name};
              </Box>
              <Box className="mr-1"> {product.quantity} pcs;</Box>
              <Box className="mr-1"> {product.quantity * product.variation.sellingPrice} MZN</Box>
            </Box>
          ))}
        </Box>
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      renderCell: (params) => <Box>{calculateTotal(params.row)} Rwf</Box>,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        return <Box>{format(new Date(params.value), 'do MMM yyyy')}</Box>;
      },
    },
    { field: 'paymentMethod', headerName: 'Payment', flex: 0 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      renderCell: (params) => <MoreButton id={params.id} model={'sale'} className="my-2" />,
    },
  ];

  return (
    <Box className="size-full flex flex-col">
      <PageHeader
        title="Sales"
        hasGenerateReport={() => {
          console.log('Generate Report of sales');
        }}
        hasCreate={() => {
          console.log('Create sales');
        }}
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
