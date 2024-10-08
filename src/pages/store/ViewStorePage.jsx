import { Box, Button, Stack, Table, TableBody, TableCell, TableRow, Typography, capitalize } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';
import { getStoreAction, selectStoreById } from '../../redux/storesSlice';
import { getAllStoreUsersAction, selectAllUsersByRole, selectLoggedInUser } from '../../redux/usersSlice';
import StatusBadge from '../../components/Table/StatusBadge';
import DeleteStoreModal from '../../components/store/DeleteStoreModal';
import { ProductsTable } from '../product/ProductsPage';
import { getAllStoreProductsAction, selectAllProductsBystoreId } from '../../redux/productsSlice';

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

const ViewStorePage = () => {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUser);
  const store = useSelector(selectStoreById(routeParams.id));
  const products = useSelector(selectAllProductsBystoreId(routeParams.id));
  const keepers = useSelector(selectAllUsersByRole(['admin', 'keeper']));
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [initLoading, setInitLoading] = useState(true);

  const storeKeepers = useMemo(() => {
    const storeKeepers = keepers?.filter((u) => u.storeId === store?.id);
    if (storeKeepers?.length > 0) return storeKeepers;
    return null;
  }, [store, keepers]);

  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };

  useEffect(() => {
    Promise.all([
      dispatch(getStoreAction(routeParams.id)),
      dispatch(getAllStoreUsersAction({ storeId: routeParams.id, role: ['keeper'] })),
      dispatch(getAllStoreProductsAction({ storeId: routeParams.id })),
    ])
      .then((resp) => {
        resp.forEach(({ error }) => {
          if (error) toast.error(error.message);
        });
      })
      .finally(() => setInitLoading(false));
  }, [dispatch, routeParams.id]);

  if (!store && initLoading) {
    return (
      <Box className="w-full h-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  if (!store) {
    return (
      <Box className="w-full h-full">
        <PageHeader title={`View store details`} hasBack={true} backTo="/dashboard/stores" />
        <Box className="w-full h-full flex">
          <Typography className="m-auto" color="secondary.light">
            Store not found
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="w-full h-full">
        <PageHeader
          title={`${capitalize(store.name)} store`}
          hasBack={user.role === 'admin'}
          backTo="/dashboard/stores"
          hasUpdate={user.role === 'admin' ? () => navigate(`/dashboard/stores/${store.id}/update`) : false}
          hasDelete={
            user.role === 'admin'
              ? !['main', 'expired'].includes(store.name.toLowerCase()) && (() => setDeleteOpen(true))
              : false
          }
        />
        <Box className="w-full px-8 py-2">
          <Typography variant="subHeader" className="font-semibold" color="primary.light">
            Store details
          </Typography>
          <Table className="w-max my-2" size="small">
            <TableBody>
              <TableRow>
                <StoreKey>Store:</StoreKey>
                <StoreValue>{capitalize(store.name)} store</StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Store keepers:</StoreKey>
                <StoreValue>
                  {storeKeepers?.map((u) => u.name).join(', ') || 'This store does not have keepers'}
                </StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Telephone number:</StoreKey>
                <StoreValue>{store.phone}</StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Location:</StoreKey>
                <StoreValue>{capitalize(store.location)}</StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Opening Date:</StoreKey>
                <StoreValue>{format(new Date(store.createdAt), 'do MMM yyyy h:mm a')}</StoreValue>
              </TableRow>
              <TableRow>
                <StoreKey>Status:</StoreKey>
                <StoreValue>
                  <StatusBadge
                    status={store.isActive ? 'Active' : 'Inactive'}
                    bg={store.isActive ? 'bg-green-500' : 'bg-red-500'}
                    color={'white'}
                  />
                </StoreValue>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <Box className="w-full px-8 py-2">
          <Stack direction="row" gap={2} className="justify-between flex-wrap mb-2">
            <Typography variant="subHeader" className="font-semibold" color="primary.light">
              Products in store
            </Typography>
            {user.role === 'admin' && (
              <Button
                LinkComponent={Link}
                to={`/dashboard/stores/${store.id}/add-product`}
                color="specialBlue"
                size="small"
                endIcon={<IoAddOutline />}
              >
                Add products
              </Button>
            )}
          </Stack>

          {products?.length > 0 ? (
            <ProductsTable
              products={products}
              omit={['action']}
              storeId={routeParams.id}
              projection
              minWidth={'1000px'}
            />
          ) : (
            <Typography color="secondary.light" className="text-center py-4">
              This store has no products
            </Typography>
          )}
        </Box>
      </Box>

      <DeleteStoreModal id={routeParams.id} open={deleteOpen} handleClose={handleCloseDelete} />
    </>
  );
};

export default ViewStorePage;
