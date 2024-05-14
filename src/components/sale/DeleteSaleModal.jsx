import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSaleAction, selectSaleById } from '../../redux/salesSlice';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Input from '../Input';
import LoadingButton from '../LoadingButton';
import { useNavigate } from 'react-router-dom';

const DeleteSaleModal = ({ open = false, handleClose, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sale = useSelector(selectSaleById(id));
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const agree = 'I Understand';

  const onChange = (e) => setValue(e.target.value);

  const handleSubmit = () => {
    if (value !== agree) return;
    setLoading(true);
    dispatch(deleteSaleAction(id)).then(({ error }) => {
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        navigate('/dashboard/sales');
      }
    });
  };

  if (!sale) return;

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle color="secondary" variant="header" className="font-semibold">
        Delete sale
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="mb-2">
          <Typography component="span" color="secondary.light">
            Attention
          </Typography>
          , by continuing with this action, you will be deleting this sale from the system records, this will remove it
          permanentlly along with some of its associated data and it can&apos;t be reversed.
        </Typography>
        <Typography variant="body2" className="mb-2 font-semibold">
          If you are sure, Enter the following word
          <Typography color="secondary.light" component="span" variant="body2" className="font-semibold mx-1">
            {agree}
          </Typography>
          to confirm.
        </Typography>
        <Input placeHolder="Enter sale name to delete" disabled={loading} inputProps={{ value, onChange }} />
      </DialogContent>
      <DialogActions className="flex-end px-6 mb-2">
        <LoadingButton loading={loading} disabled={value !== agree} color="secondary" onClick={handleSubmit}>
          Yes, delete
        </LoadingButton>
        <Button disabled={loading} onClick={handleClose}>
          No, cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSaleModal;
