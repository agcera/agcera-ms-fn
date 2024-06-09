import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  capitalize,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { getDeletedItemByIdAction, selectDeletedById } from '../../redux/deletedSlice';
import { format } from 'date-fns';

const ViewTrashModel = ({ open = false, handleClose, id, model }) => {
  const dispatch = useDispatch();
  const deleted = useSelector(selectDeletedById(id));

  const deletedObject = open ? JSON.parse(deleted.description) : null;

  useEffect(() => {
    dispatch(getDeletedItemByIdAction(id));
  }, [dispatch, id]);

  if (!deletedObject) return;

  const TableKey = ({ children, ...props }) => {
    return (
      <TableCell className="border-none pl-0 font-semibold text-sm" {...props}>
        {children}
      </TableCell>
    );
  };
  const TableValue = ({ children, ...props }) => {
    return (
      <TableCell className="border-none pl-0 text-sm" {...props}>
        {children}
      </TableCell>
    );
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle color="secondary" variant="header" className="font-semibold">
        Deleted {model === 'user' ? 'User' : 'Store'} Details
      </DialogTitle>
      <DialogContent>
        {/* if table deleted object was user the table will look like this  */}

        {model === 'user' && (
          <Table>
            <TableBody>
              <TableRow>
                <TableKey>UserId</TableKey>
                <TableValue>{deletedObject.user.id}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Name</TableKey>
                <TableValue>{deletedObject.user.name}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Phone</TableKey>
                <TableValue>{deletedObject.user.phone}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Email</TableKey>
                <TableValue>{deletedObject.user?.email || 'Not Applicable'}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Role</TableKey>
                <TableValue>{deletedObject.user.role}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Store</TableKey>
                <TableValue>{deletedObject.user.store.name}</TableValue>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {/* // other wise */}
        {model === 'store' && (
          <Table className="w-max my-2" size="small">
            <TableBody>
              <TableRow>
                <TableKey>Store:</TableKey>
                <TableValue>{capitalize(deletedObject.store.name)} store</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Store keepers:</TableKey>
                <TableValue>
                  {
                    // map amoung the store users to find one with role user
                    // if found return the name of the user
                    deletedObject.store.users.find((u) => u.role === 'keeper').name || 'This store has no keepers'
                    // storeKeepers?.map((u) => u.name).join(', ') || 'This store has no keepers'
                  }
                </TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Telephone number:</TableKey>
                <TableValue>{deletedObject.store.phone}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Location:</TableKey>
                <TableValue>{capitalize(deletedObject.store.location)}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Opening Date:</TableKey>
                <TableValue>{format(new Date(deletedObject.store.createdAt), 'do MMM yyyy')}</TableValue>
              </TableRow>

              <Box className="w-full h-1 bg-primary"></Box>

              {/* users  */}

              <Typography className="font-bold text-secondary">Users</Typography>
              {deletedObject.store.users.map((user) => (
                <TableRow key={user.id}>
                  <TableKey>{user.name}</TableKey>
                  <TableValue>{user.phone}</TableValue>
                </TableRow>
              ))}

              {/* products  */}

              <Box className="w-full h-1 bg-primary"></Box>

              <Typography className="font-bold text-secondary">products</Typography>
              {deletedObject.store.products.map((product) => (
                <TableRow key={product.id}>
                  <TableKey>{product.product.name}</TableKey>
                  <TableValue>{product.quantity} pieces</TableValue>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {model === 'product' && (
          <Table>
            <TableBody>
              <TableRow>
                <TableKey>Name</TableKey>
                <TableValue>{deletedObject.product.name}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Type</TableKey>
                <TableValue>{deletedObject.product.type}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Description</TableKey>
                <TableValue>{deletedObject.product.description}</TableValue>
              </TableRow>
              <TableRow>
                <TableKey>Variation </TableKey>
                <TableValue>{deletedObject.product.variations[0].name}</TableValue>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions className="flex-end px-6 mb-2">
        <Button onClick={handleClose}>close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTrashModel;
