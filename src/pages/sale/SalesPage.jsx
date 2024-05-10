import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import { getAllSalesAction, selectAllSales } from '../../redux/salesSlice';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import StyledTable from '../../components/Table/StyledTable';
import MoreButton from '../../components/Table/MoreButton';

const SalesPage = () => {
  const dispatch = useDispatch();

  const sales = useSelector(selectAllSales);

  console.log(sales, 'salesssss ');
  useEffect(() => {
    dispatch(getAllSalesAction({}));
  }, [dispatch]);

  const calculateTotal = (sale) => {
    let total = 0;
    sale.products.forEach((product) => {
      total += product.quantity * product.variation.sellingPrice;
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
      field: 'products',
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
      renderCell: (params) => <Box>{calculateTotal(params.row)}</Box>,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toISOString().split('T')[0];
        return <Box>{formattedDate}</Box>;
      },
    },
    { field: 'paymentMethod', headerName: 'Payment', flex: 0.5 },
    { headerName: 'Action', flex: 1, renderCell: (params) => <MoreButton id={params.id} model={'sale'} /> },
  ];

  return (
    <Box>
      <PageHeader
        title="Sales"
        hasGenerateReport={() => {
          console.log('Generate Report of sales');
        }}
        hasCreate={() => {
          console.log('Create sales');
        }}
      />
      <StyledTable data={sales} columns={columns} rowheight={'auto'} />
    </Box>
  );
};

export default SalesPage;
