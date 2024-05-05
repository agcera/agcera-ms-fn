import { Box, Button, Stack, Table, TableBody, TableCell, TableRow, Typography, capitalize } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';
import { getStoreAction, selectStoreById } from '../../redux/storesSlice';

const StoreKey = ({ children, ...props }) => {
  return (
    <TableCell className="border-none pl-0" {...props}>
      <Typography variant="body2" className="font-semibold ">
        {children}
      </Typography>
    </TableCell>
  );
};
const StoreValue = ({ children, ...props }) => {
  return (
    <TableCell className="border-none pl-0" {...props}>
      <Typography variant="body2" className="">
        {children}
      </Typography>
    </TableCell>
  );
};

const ViewStorePage = () => {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const store = useSelector(selectStoreById(routeParams.id));
  const [initLoading, setInitLoading] = useState(true);

  console.log('store: ', store);

  const storeKeepers = useMemo(() => {
    if (!store) return [];
    return store.users.filter((u) => ['admin', 'keeper'].includes(u.role));
  }, [store]);

  useEffect(() => {
    dispatch(getStoreAction(routeParams.id)).then(({ error }) => {
      setInitLoading(false);
      if (error) {
        toast.error(error.message);
      }
    });
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
    <Box className="w-full h-full">
      <PageHeader title={`${capitalize(store.name)} store`} hasBack={true} backTo="/dashboard/stores" />
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
              <StoreValue>{storeKeepers.map((u) => u.name).join(', ')}</StoreValue>
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
              <StoreValue>{format(new Date(store.createdAt), 'do MMM yyyy')}</StoreValue>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box className="w-full px-8 py-2">
        <Stack direction="row" gap={2} className="justify-between flex-wrap mb-2">
          <Typography variant="subHeader" className="font-semibold" color="primary.light">
            Products in store
          </Typography>
          <Button
            LinkComponent={Link}
            to={`/dashboard/stores/${store.id}/add-product`}
            color="specialBlue"
            size="small"
            endIcon={<IoAddOutline />}
          >
            Add product
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ViewStorePage;
