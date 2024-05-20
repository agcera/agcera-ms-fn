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
import { ProductsTable } from '../product/ProductsPage';
import DeleteSaleModal from '../../components/sale/DeleteSaleModal';
import { getDeletedItemByIdAction, selectDeletedById } from '../../redux/deletedSlice';

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

const ViewSalePage = ({ wasDeleted }) => {
  const dispatch = useDispatch();
  const { id: saleId } = useParams();

  let sale = null;

  const saleObject = useSelector(wasDeleted ? selectDeletedById(saleId) : selectSaleById(saleId));
  console.log(saleObject, 'SALE OBJECT');

  // if the sale was deleted we will get the deleted sale from the sale description
  if (wasDeleted) {
    sale = saleObject && JSON.parse(saleObject.description);
    console.log(sale, 'after parse');
    sale = sale?.sale;
  } else {
    sale = saleObject;
  }

  const client = useSelector(selectUserById(sale?.clientId));
  const user = useSelector(selectLoggedInUser);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  // check the route that was used to get to this page
  // if the route was /dashboard/sale/deleted/:id, then the sale was deleted
  // and we should show the delete modal

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

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
    dispatch(wasDeleted ? getDeletedItemByIdAction(saleId) : getSaleAction(saleId)).then(({ error }) => {
      setInitLoading(false);
      if (error) toast.error(error.message);
    });
  }, [dispatch, saleId, wasDeleted]);

  useEffect(() => {
    if (sale?.clientType === 'USER') {
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
          backTo={wasDeleted ? '/dashboard/history/trash' : '/dashboard/sales'}
          hasDelete={wasDeleted ? false : user.role !== 'user' && (() => setDeleteOpen(true))}
        />
        <Box className="w-full px-8 py-2">
          <Typography variant="subHeader" className="font-semibold" color={wasDeleted ? 'secondary' : 'primary.light'}>
            {wasDeleted ? 'Deleted Sale Details' : ' Sale details'}
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
              <ProductsTable products={soldProducts} omit={['action', 'createdAt']} />
            ) : (
              <Typography color="secondary.light" className="text-center py-4">
                This sale has no products
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {user.role !== 'user' && <DeleteSaleModal id={saleId} open={deleteOpen} handleClose={handleDeleteClose} />}
    </>
  );
};

export default ViewSalePage;
