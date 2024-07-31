import {
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
import { useSelector } from 'react-redux';
import { selectTransactionById } from '../../redux/transactionsSlice';
import { format } from 'date-fns';
import StatusBadge from '../Table/StatusBadge';

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

const DetailsTransactionModal = ({ id, open = false, handleClose }) => {
  const transaction = useSelector(selectTransactionById(id));

  if (!transaction) return;

  return (
    <Dialog onClose={handleClose} open={open} classes={{ paper: 'w-full' }}>
      <DialogTitle color="primary.light" variant="header" className="font-semibold">
        Transaction details
      </DialogTitle>
      <DialogContent>
        <Table className="w-max my-2" size="small">
          <TableBody>
            <TableRow>
              <StoreKey>Transaction ID :</StoreKey>
              <StoreValue>{transaction.id}</StoreValue>
            </TableRow>
            <TableRow>
              <StoreKey>Store :</StoreKey>
              <StoreValue>
                {' '}
                {transaction.store ? (
                  capitalize(transaction.store.name)
                ) : (
                  <span className="text-secondary">Deleted Store</span>
                )}
              </StoreValue>
            </TableRow>
            <TableRow>
              <StoreKey>Done By :</StoreKey>
              <StoreValue>
                {transaction.user ? (
                  capitalize(transaction.user.name)
                ) : (
                  <span className="text-secondary">Deleted User</span>
                )}
              </StoreValue>
            </TableRow>
            <TableRow>
              <StoreKey>Amount :</StoreKey>
              <StoreValue>{transaction.amount} MZN</StoreValue>
            </TableRow>
            <TableRow>
              <StoreKey>Done On :</StoreKey>
              <StoreValue>{format(new Date(transaction.createdAt), 'do MMM yyyy h:mm a')}</StoreValue>
            </TableRow>
            <TableRow>
              <StoreKey>Tranasction type :</StoreKey>
              <StoreValue>
                <StatusBadge
                  status={transaction.type}
                  bg={transaction.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'}
                  color={'white'}
                />
              </StoreValue>
            </TableRow>
          </TableBody>
        </Table>
        <Typography className="font-semibold mt-2">Description: </Typography>
        <Typography className="px-2 py-2">{transaction.description}</Typography>
      </DialogContent>
      <DialogActions className="flex-end px-6 mb-2">
        <Button onClick={handleClose}>Close details</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsTransactionModal;
