import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserAction, selectUserById } from '../../redux/usersSlice';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Input from '../Input';
import LoadingButton from '../LoadingButton';
import { useNavigate } from 'react-router-dom';

const DeleteUserModal = ({ open = false, handleClose, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUserById(id));
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const onChange = (e) => setValue(e.target.value);

  const handleSubmit = () => {
    if (value !== user.name) return;
    setLoading(true);
    dispatch(deleteUserAction(id)).then(({ error }) => {
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        navigate('/dashboard/users');
      }
    });
  };

  if (!user) return;

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle color="secondary" variant="header" className="font-semibold">
        Delete user
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="mb-2">
          <Typography component="span" color="secondary.light">
            Attention
          </Typography>
          , by continuing with this action, you will be deleting this user from the system records, this will remove it
          permanentlly along with some of its associated data and it can&apos;t be reversed.
        </Typography>
        <Typography variant="body2" className="mb-2 font-semibold">
          If you are sure, Enter the following name
          <Typography color="secondary.light" component="span" variant="body2" className="font-semibold mx-1">
            {user.name}
          </Typography>
          to confirm.
        </Typography>
        <Input placeHolder="Enter user name to delete" disabled={loading} inputProps={{ value, onChange }} />
      </DialogContent>
      <DialogActions className="flex-end px-6 mb-2">
        <LoadingButton loading={loading} disabled={value !== user.name} color="secondary" onClick={handleSubmit}>
          Yes, delete
        </LoadingButton>
        <Button disabled={loading} onClick={handleClose}>
          No, cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;
