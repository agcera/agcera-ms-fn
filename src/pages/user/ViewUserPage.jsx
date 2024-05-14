import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserAction, selectLoggedInUser, selectUserById } from '../../redux/usersSlice';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, Table, TableBody, TableCell, TableRow, Typography, capitalize } from '@mui/material';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';
import { format } from 'date-fns';
import DeleteUserModal from '../../components/user/DeleteUserModal';

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

const ViewUserPage = () => {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(routeParams.id ? selectUserById(routeParams.id) : selectLoggedInUser);
  const [initLoading, setInitLoading] = useState(routeParams.id ? true : false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };

  useEffect(() => {
    if (!routeParams.id) return;
    dispatch(getUserAction(routeParams.id)).then(({ error }) => {
      setInitLoading(false);
      if (error) toast.error(error.message);
    });
  }, [routeParams.id, dispatch]);

  if (!user && initLoading) {
    return (
      <Box className="size-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <PageHeader title="User details" hasBack={true} backTo="/dashboard/users" />
        <Typography className="w-full text-center p-4" color="secondary.light">
          User not found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <PageHeader
          title="User details"
          hasBack={true}
          backTo="/dashboard/users"
          hasDelete={() => setDeleteOpen(true)}
          hasUpdate={() => navigate(`/dashboard/users/${user.id}/update`)}
        />
        <Box className="w-full px-8 py-2 flex flex-col md:flex-row gap-8">
          <Box className="grow flex">
            <img
              src={user.image}
              alt="avatar"
              className="max-w-[250px] w-full h-max aspect-square mt-2 rounded-xl md:ml-auto object-cover"
            />
          </Box>

          <Box className="grow mb-4">
            <Table className="w-max" size="small">
              <TableBody>
                <TableRow>
                  <StoreKey>Name :</StoreKey>
                  <StoreValue>{capitalize(user.name)}</StoreValue>
                </TableRow>
                <TableRow>
                  <StoreKey>Phone number :</StoreKey>
                  <StoreValue>{user.phone}</StoreValue>
                </TableRow>
                <TableRow>
                  <StoreKey>Email :</StoreKey>
                  <StoreValue>{user.email || 'User has no email'}</StoreValue>
                </TableRow>
                <TableRow>
                  <StoreKey>User Role :</StoreKey>
                  <StoreValue>{capitalize(user.role)}</StoreValue>
                </TableRow>
                <TableRow>
                  <StoreKey>Gender :</StoreKey>
                  <StoreValue>{capitalize(user.gender.toLowerCase())}</StoreValue>
                </TableRow>
                <TableRow>
                  <StoreKey>Address :</StoreKey>
                  <StoreValue>{user.location || 'User has no address'}</StoreValue>
                </TableRow>
                <TableRow>
                  <StoreKey>Store :</StoreKey>
                  <StoreValue>{capitalize(user.store?.name || 'User is not in any store')}</StoreValue>
                </TableRow>
                <TableRow>
                  <StoreKey>Created :</StoreKey>
                  <StoreValue>{format(new Date(user.createdAt), 'do MMM yyyy')}</StoreValue>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
      <DeleteUserModal id={user.id} open={deleteOpen} handleClose={handleCloseDelete} />,
    </>
  );
};

export default ViewUserPage;
