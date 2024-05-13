import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProductAction, selectProductById } from '../../redux/productsSlice';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Input from '../Input';
import LoadingButton from '../LoadingButton';

const DeleteProductModal = ({ open = false, handleClose, id }) => {
  const dispatch = useDispatch();
  const product = useSelector(selectProductById(id));
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const onChange = (e) => setValue(e.target.value);

  const handleSubmit = () => {
    if (value !== product.name) return;
    setLoading(true);
    dispatch(deleteProductAction(id)).then(({ error }) => {
      setLoading(false);
      if (error) toast.error(error.message);
    });
  };

  if (!product) return;

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle color="secondary" variant="header" className="font-semibold">
        Delete product
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="mb-2">
          <Typography component="span" color="secondary.light">
            Attention
          </Typography>
          , by continuing with this action, you will be deleting this product from the main store and all other stores,
          this will remove them all and can&apos;t be reversed.
        </Typography>
        <Typography variant="body2" className="mb-2 font-semibold">
          If you are sure of your action, Enter the following product name{' '}
          <Typography color="secondary.light" component="span" className="font-bold">
            {product.name}
          </Typography>{' '}
          to confirm.
        </Typography>
        <Input placeHolder="Enter product name to delete" disabled={loading} inputProps={{ value, onChange }} />
      </DialogContent>
      <DialogActions className="flex-end px-6 mb-2">
        <LoadingButton loading={loading} disabled={value !== product.name} color="secondary" onClick={handleSubmit}>
          Yes, delete
        </LoadingButton>
        <Button disabled={loading} onClick={handleClose}>
          No, cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductModal;
