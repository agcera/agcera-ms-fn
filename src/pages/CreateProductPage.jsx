import { Box, Button, Grid, MenuItem, Stack, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import Input from '../components/Input';
import Select from '../components/Select';
import { Link, useNavigate } from 'react-router-dom';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { productCreateSpecialSchema, productCreateStandardSchema } from '../validations/products.validation';
import Variations from '../components/products/Variations';
import { createProductAction } from '../redux/productsSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import LoadingButton from '../components/LoadingButton';
import { PiUploadFill } from 'react-icons/pi';

const CreateProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [type, setType] = useState('STANDARD');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(type === 'STANDARD' ? productCreateStandardSchema : productCreateSpecialSchema),
    defaultValues: {
      name: '',
      costPrice: 0,
      sellingPrice: 0,
      variations: [],
    },
  });
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods;

  const onSubmit = (data) => {
    const productData = {};

    productData.name = data.name;
    productData.type = type;
    productData.image = image;

    if (type === 'STANDARD') {
      productData.variations = [
        {
          name: 'Default',
          description: data.description,
          costPrice: data.costPrice,
          sellingPrice: data.sellingPrice,
        },
      ];
    } else {
      productData.variations = data.variations;
    }

    setLoading(true);
    dispatch(createProductAction(productData)).then(({ payload, error }) => {
      setLoading(false);
      if (payload) {
        navigate('/dashboard/products');
      } else {
        toast.error(error.message);
      }
    });
  };

  return (
    <Form action="" method="post" control={control} onSubmit={handleSubmit(onSubmit)}>
      <Box className="w-full h-full">
        <PageHeader title="Create Product" hasBack={true} backTo="/dashboard/products" />

        <Grid container rowSpacing={1} columnSpacing={2} className="px-4 mb-8">
          <Grid item xs={12} md={6}>
            <Input
              label="Product Name"
              placeHolder="Enter product name..."
              disabled={loading}
              error={!!errors.name}
              helperText={errors.name?.message}
              inputProps={{ ...register('name') }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              label="Type"
              placeHolder="Select the product type"
              disabled={loading}
              error={!!errors.type}
              helperText={errors.type?.message}
              inputProps={{ value: type, onChange: (e) => setType(e.target.value) }}
            >
              <MenuItem value={'STANDARD'}>Standard</MenuItem>
              <MenuItem value={'SPECIAL'}>Special</MenuItem>
            </Select>
          </Grid>
          {type === 'STANDARD' && (
            <>
              <Grid item xs={12} md={6}>
                <Input
                  label="Cost Price"
                  placeHolder="Enter product cost price..."
                  disabled={loading}
                  error={!!errors.costPrice}
                  helperText={errors.costPrice?.message}
                  inputProps={{ type: 'number', ...register('costPrice'), inputProps: { step: '.01', min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Input
                  label="Selling Price"
                  placeHolder="Enter product selling price..."
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
              <Grid item xs={12}>
                <Input
                  label="Description"
                  placeHolder="Enter product description..."
                  disabled={loading}
                  required={false}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  inputProps={{ multiline: true, minRows: 2, ...register('description') }}
                />
              </Grid>
            </>
          )}
        </Grid>

        {type === 'SPECIAL' && (
          <Box className="px-4 mb-8">
            <FormProvider {...methods}>
              <Variations loading={loading} />
            </FormProvider>
          </Box>
        )}

        <Box className="flex flex-col px-4 mb-4 gap-2">
          <Typography variant="subHeader" component="label" htmlFor="image" className="font-medium">
            Product Image <span className="text-secondary"> *</span>
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
              alt="product"
              className="max-w-[500px] w-full h-full aspect-[2/1] object-cover border border-dashed rounded-md p-2"
            />
          )}
        </Box>

        <Stack direction="row-reverse" spacing={2} className="px-4 mb-4">
          <Button
            LinkComponent={Link}
            to="/dashboard/products"
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
            Add product
          </LoadingButton>
        </Stack>
      </Box>
    </Form>
  );
};

export default CreateProductPage;
