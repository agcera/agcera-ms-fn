import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Input from '../Input';
import LoadingButton from '../LoadingButton';
import { deleteStoreAction, selectStoreById } from '../../redux/storesSlice';
import { useNavigate } from 'react-router-dom';

const DeleteStoreModal = ({ open = false, handleClose, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector(selectStoreById(id));
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const onChange = (e) => setValue(e.target.value);

  const handleSubmit = () => {
    if (value !== store.name) return;
    setLoading(true);
    dispatch(deleteStoreAction(id)).then(({ error }) => {
      setLoading(false);
      if (!error) {
        navigate('/dashboard/stores');
      } else {
        toast.error(error.message);
      }
    });
  };

  if (!store) return;

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle color="secondary" variant="header" className="font-semibold">
        Delete store
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="mb-2">
          <Typography component="span" color="secondary.light">
            Attention
          </Typography>
          , by continuing with this action, you will be deleting this store and its associated data.
        </Typography>
        <Typography variant="body2" className="mb-2 font-semibold">
          If you are sure of your action, Enter the following store name{' '}
          <Typography color="secondary.light" component="span" className="font-bold">
            {store.name}
          </Typography>{' '}
          to confirm.
        </Typography>
        <Input placeHolder="Enter store name to delete" disabled={loading} inputProps={{ value, onChange }} />
      </DialogContent>
      <DialogActions className="flex-end px-6 mb-2">
        <LoadingButton loading={loading} disabled={value !== store.name} color="secondary" onClick={handleSubmit}>
          Yes, delete
        </LoadingButton>
        <Button disabled={loading} onClick={handleClose}>
          No, cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteStoreModal;
