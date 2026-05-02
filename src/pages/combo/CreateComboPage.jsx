import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import LoadingButton from '../../components/LoadingButton';
import ComboItems from '../../components/combos/ComboItems';
import { createComboAction } from '../../redux/combosSlice';
import { comboCreateSchema } from '../../validations/combos.validation';
import { PiUploadFill } from 'react-icons/pi';

const CreateComboPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(comboCreateSchema),
    defaultValues: {
      name: '',
      costPrice: 0,
      sellingPrice: 0,
      items: [],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = methods;

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      costPrice: data.costPrice,
      sellingPrice: data.sellingPrice,
      items: data.items,
      image,
    };

    setLoading(true);
    dispatch(createComboAction(payload)).then(({ payload, error }) => {
      setLoading(false);
      if (payload) {
        navigate('/dashboard/combos');
      } else {
        toast.error(error.message);
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form method="post" action="" onSubmit={handleSubmit(onSubmit)}>
        <Box className="w-full h-full">
          <PageHeader title="Create Combo" hasBack={true} backTo="/dashboard/combos" />

          <Grid container rowSpacing={1} columnSpacing={2} className="px-4 mb-8">
            <Grid item xs={12} md={6}>
              <Input
                label="Combo Name"
                placeHolder="Enter combo name..."
                disabled={loading}
                error={!!errors.name}
                helperText={errors.name?.message}
                inputProps={{ ...register('name') }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Cost Price"
                placeHolder="Enter combo cost price..."
                disabled={loading}
                error={!!errors.costPrice}
                helperText={errors.costPrice?.message}
                inputProps={{ type: 'number', ...register('costPrice'), inputProps: { step: '.01', min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Selling Price"
                placeHolder="Enter combo selling price..."
                disabled={loading}
                error={!!errors.sellingPrice}
                helperText={errors.sellingPrice?.message}
                inputProps={{
                  type: 'number',
                  ...register('sellingPrice'),
                  inputProps: { step: '.01', min: watch('costPrice') },
                }}
              />
            </Grid>
          </Grid>

          <Box className="px-4 mb-8">
            <ComboItems loading={loading} />
          </Box>

          <Box className="flex flex-col px-4 mb-4 gap-2">
            <Typography variant="subHeader" component="label" htmlFor="image" className="font-medium">
              Combo Image <span className="text-secondary"> *</span>
            </Typography>
            <Input
              disabled={loading}
              inputProps={{
                type: 'file',
                accept: 'image/*',
                className: 'w-full max-w-[450px]',
                classes: { input: 'h-[50px]' },
                name: 'image',
                id: 'image',
                onChange: (e) => setImage(e.target.files[0]),
                inputProps: { accept: 'image/*' },
              }}
            />
            {!image ? (
              <Box
                component="label"
                htmlFor="image"
                className="flex flex-col justify-center items-center border border-dashed rounded-md p-2 max-w-[500px] w-full h-full aspect-[2/1] cursor-pointer hover:bg-light-blue-50/50"
              >
                <PiUploadFill size={40} />
                <Typography variant="subHeader" color="secondary.light" className="text-center font-medium">
                  Click to upload image
                </Typography>
              </Box>
            ) : (
              <img
                src={URL.createObjectURL(image)}
                alt="combo"
                className="max-w-[500px] w-full h-full aspect-[2/1] object-cover border border-dashed rounded-md p-2"
              />
            )}
          </Box>

          <Stack direction="row-reverse" spacing={2} className="px-4 mb-4">
            <Button
              LinkComponent={Link}
              to="/dashboard/combos"
              color="secondary"
              className="max-w-[175px] w-full"
              disabled={loading}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              type="submit"
              className="max-w-[175px] w-full"
              disabled={!isDirty || !image || loading}
            >
              Add combo
            </LoadingButton>
          </Stack>
        </Box>
      </form>
    </FormProvider>
  );
};

export default CreateComboPage;
