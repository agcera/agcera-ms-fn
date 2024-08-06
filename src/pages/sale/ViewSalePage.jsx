import { Box, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getSaleAction, selectSaleById } from '../../redux/salesSlice';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Loader from '../../components/Loader';
import { getUserAction, selectLoggedInUser, selectUserById } from '../../redux/usersSlice';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import RefundSaleModal from '../../components/sale/RefundSaleModal';
import StyledTable from '../../components/Table/StyledTable';
import { calculateProfit, calculateTotal } from '../../utils/sales.utils';

const StoreKey = ({ children, ...props }) => {
  return (
    <TableCell className="border-none pl-0 font-semibold text-sm" {...props}>
      {children}
    </TableCell>
  );
};
const StoreValue = ({ children, ...props }) => {
  return (
    <TableCell className="border-none pl-0 text-sm" {...props}>
      {children}
    </TableCell>
  );
};

const ViewSalePage = () => {
  const dispatch = useDispatch();
  const { id: saleId } = useParams();

  const sale = useSelector(selectSaleById(saleId));

  const refundedAt = sale?.refundedAt || false;

  const client = useSelector(selectUserById(sale?.clientId));
  const user = useSelector(selectLoggedInUser);
  const [refundOpen, setRefundOpen] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  // check the route that was used to get to this page
  // if the route was /dashboard/sale/deleted/:id, then the sale was deleted
  // and we should show the delete modal

  const handleDeleteClose = () => {
    setRefundOpen(false);
  };

  // build column for variations to be displayed in the table
  const transformedData = sale?.variations.map((variations) => ({
    id: variations.variation.id,
    productName: variations.variation.product.name,
    variationName: variations.variation.name,
    variationNumber: variations.variation.number,
    quantity: variations.quantity,
    totalSellingPrice: variations.quantity * variations.variation.sellingPrice,
  }));

  const columns = [
    { field: 'productName', headerName: 'Product Name', flex: 1 },
    { field: 'variationName', headerName: 'Var Name', flex: 1 },
    { field: 'variationNumber', headerName: 'Var Number', flex: 0 },
    { field: 'quantity', headerName: 'Quantity', flex: 0, valueGetter: (params, row) => `${row.quantity} pcs` },
    {
      field: 'totalSellingPrice',
      headerName: 'Total Selling Price',
      flex: 1,
      valueGetter: (params, row) => `${row.totalSellingPrice} MZN`,
    },
  ];

  const clientDetails = useMemo(() => {
    if (!sale) return 'Fetching details ....';
    if (sale.clientType === 'USER') {
      if (sale.clientId === null) return <span className="text-secondary"> Deleted User </span>;
      if (!client) return 'Fetching details ....';
      return `${client.name} |---| ${client.email}, ${client.phone}`;
    } else {
      return sale.clientId;
    }
  }, [client, sale]);
  const soldProducts = useMemo(() => {
    return sale?.variations?.reduce((acc, variation) => {
      const product = acc.find((p) => p.id === variation.variation.productId);
      if (product) {
        product.variations.push(variation.variation);
      } else {
        acc.push({
          ...variation.variation.product,
          variations: [variation.variation],
        });
      }
      return acc;
    }, []);
  }, [sale?.variations]);

  useEffect(() => {
    dispatch(getSaleAction(saleId)).then(({ error }) => {
      setInitLoading(false);
      if (error) toast.error(error.message);
    });
  }, [dispatch, saleId]);

  useEffect(() => {
    if (sale?.clientType === 'USER' && sale?.clientId) {
      dispatch(getUserAction(sale.clientId)).then(({ error }) => {
        if (error) toast.error(error.message);
      });
    }
  }, [dispatch, sale?.clientType, sale?.clientId]);

  if (!sale && initLoading) {
    return (
      <Box className="w-full h-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  if (!sale) {
    return (
      <Box className="w-full h-full">
        <PageHeader title={`View sale details`} hasBack={true} backTo="/dashboard/sale" />
        <Box className="w-full h-full flex">
          <Typography className="m-auto" color="secondary.light">
            Sale not found
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <PageHeader
          title={`View Sale details`}
          hasBack={true}
          backTo={'/dashboard/sales'}
          hasDelete={refundedAt ? false : user.role !== 'user' && (() => setRefundOpen(true))}
          altDeleteText={'Refund'}
        />
        <Box className="w-full px-8 py-2">
          <Typography variant="subHeader" className="font-semibold" color={refundedAt ? 'secondary' : 'primary.light'}>
            {refundedAt ? 'Refunded Sale Details' : ' Sale details'}
          </Typography>
          <Table className="w-max my-2" size="small">
            <TableBody>
              <TableRow>
                <StoreKey>Sale ID :</StoreKey>
                <StoreValue>{sale.id}</StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Payment method :</StoreKey>
                <StoreValue>{sale.paymentMethod}</StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Client Type :</StoreKey>
                <StoreValue>{sale.clientType === 'USER' ? 'Member' : 'Guest'}</StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Client details :</StoreKey>
                <StoreValue>{clientDetails}</StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Store :</StoreKey>
                <StoreValue>{sale.store?.name || <span className="text-secondary">Deleted Store</span>}</StoreValue>
              </TableRow>
              {user.role === 'admin' && (
                <TableRow>
                  <StoreKey>Purchase profit :</StoreKey>
                  <StoreValue>{calculateProfit(sale)} MZN</StoreValue>
                </TableRow>
              )}
              <TableRow>
                <StoreKey>Purchase total :</StoreKey>
                <StoreValue>{calculateTotal(sale)} MZN</StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Purchased On :</StoreKey>
                <StoreValue>{format(new Date(sale.createdAt), 'do MMM yyyy h:mm a')}</StoreValue>
              </TableRow>
              {sale.checkedAt && (
                <TableRow>
                  <StoreKey>Collected On :</StoreKey>
                  <StoreValue>{format(new Date(sale.checkedAt), 'do MMM yyyy h:mm a')}</StoreValue>
                </TableRow>
              )}
              {sale.refundedAt && (
                <TableRow>
                  <StoreKey>Cancelled On :</StoreKey>
                  <StoreValue>{format(new Date(sale.refundedAt), 'do MMM yyyy h:mm a')}</StoreValue>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box className="w-full py-2">
            <Typography variant="subHeader" className="font-semibold" color="primary.light">
              Products purchased
            </Typography>

            {soldProducts?.length > 0 ? (
              <StyledTable data={transformedData} columns={columns} />
            ) : (
              // <ProductsTable products={soldProducts} omit={['action', 'createdAt']} />
              <Typography color="secondary.light" className="text-center py-4">
                This sale has no products
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {user.role !== 'user' && <RefundSaleModal id={saleId} open={refundOpen} handleClose={handleDeleteClose} />}
    </>
  );
};

export default ViewSalePage;
