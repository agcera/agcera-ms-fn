import { Box, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getSaleAction, selectSaleById } from '../../redux/salesSlice';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Loader from '../../components/Loader';
import { getUserAction, selectUserById } from '../../redux/usersSlice';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ProductsTable } from '../product/ProductsPage';

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
  const client = useSelector(selectUserById(sale?.clientId));
  const [initLoading, setInitLoading] = useState(true);

  const calculateTotal = (sale) => {
    let total = 0;
    sale.variations.forEach((variation) => {
      total += variation.quantity * variation.variation.number * variation.variation.sellingPrice;
    });
    return total;
  };

  const clientDetails = useMemo(() => {
    if (!sale) return 'Fetching details ....';
    if (sale.clientType === 'USER') {
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
    if (sale && sale.clientType === 'USER') {
      dispatch(getUserAction(sale.clientId)).then(({ error }) => {
        if (error) toast.error(error.message);
      });
    }
  }, [dispatch, sale]);

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
    <Box>
      <PageHeader
        title={`View Sale details`}
        hasBack={true}
        backTo="/dashboard/sales"
        hasDelete={() => {
          console.log('delete sale');
        }}
      />
      <Box className="w-full px-8 py-2">
        <Typography variant="subHeader" className="font-semibold" color="primary.light">
          Sale details
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
              <StoreValue>{sale.store.name}</StoreValue>
            </TableRow>
            <TableRow>
              <StoreKey>Purchase total :</StoreKey>
              <StoreValue>{calculateTotal(sale)} MZN</StoreValue>
            </TableRow>
            <TableRow>
              <StoreKey>Purchased On :</StoreKey>
              <StoreValue>{format(new Date(sale.createdAt), 'do MMM yyyy')}</StoreValue>
            </TableRow>
            {sale.deletedAt && (
              <TableRow>
                <StoreKey>Cancelled On :</StoreKey>
                <StoreValue>{format(new Date(sale.deletedAt), 'd0 MMM yyyy')}</StoreValue>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Box className="w-full py-2">
          <Typography variant="subHeader" className="font-semibold" color="primary.light">
            Products purchased
          </Typography>

          {soldProducts?.length > 0 ? (
            <ProductsTable products={soldProducts} />
          ) : (
            <Typography color="secondary.light" className="text-center py-4">
              This sale has no products
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ViewSalePage;
