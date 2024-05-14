import { Box, Button, Grid, MenuItem } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { Controller, Form, useForm } from 'react-hook-form';
import Select from '../../components/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import { createTransactionSchema } from '../../validations/transactions.validation';
import Input from '../../components/Input';
import LoadingButton from '../../components/LoadingButton';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTransactionAction } from '../../redux/transactionsSlice';
import { toast } from 'react-toastify';

const CreateTransactionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(createTransactionSchema),
    defaultValues: {
      type: 'INCOME',
      amount: 0,
      description: '',
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(createTransactionAction(data)).then(({ error }) => {
      setLoading(false);
      if (!error) {
        navigate('/dashboard/transactions');
      } else {
        toast.error(error.message);
      }
    });
  };

  return (
    <Form control={control} method="post" action="" onSubmit={handleSubmit(onSubmit)}>
      <PageHeader title="Add a transaction" hasBack={true} to="/dashboard/transactions" />
      <Grid container className="px-4 py-2" spacing={1}>
        <Grid item xs={12}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <Select label="Transaction Type" disabled={loading} inputProps={{ ...field }}>
                  <MenuItem value="INCOME">Income</MenuItem>
                  <MenuItem value="EXPENSE">Expense</MenuItem>
                </Select>
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <Input
                  label="Amount"
                  placeHolder="Enter the transaction amount..."
                  disabled={loading}
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ ...field, type: 'number', inputProps: { min: 0 } }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <Input
                  label="Description"
                  placeHolder="Enter the transaction details..."
                  disabled={loading}
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ ...field, minRows: 2, multiline: true, type: 'number', inputProps: { min: 0 } }}
                />
              );
            }}
          />
        </Grid>
      </Grid>
      <Box className="p-4 flex justify-end gap-2 w-full">
        <LoadingButton loading={loading} type="submit" className="w-full max-w-[175px]">
          Submit
        </LoadingButton>
        <Button
          disabled={loading}
          LinkComponent={Link}
          to="/dashboard/transactions"
          color="secondary"
          className="w-full max-w-[175px]"
        >
          Cancel
        </Button>
      </Box>
    </Form>
  );
};

export default CreateTransactionPage;
