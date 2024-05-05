import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Input from '../components/Input';
import LoadingButton from '../components/LoadingButton';
import PageHeader from '../components/PageHeader';
import Variations from '../components/products/Variations';
import { productUpdateSpecialSchema, productUpdateStandardSchema } from '../validations/products.validation';
import { getProductAction, selectProductById, updateProductAction } from '../redux/productsSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const UpdateProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();
  const product = useSelector(selectProductById(routeParams.id));
  const [type, setType] = useState('STANDARD');
  const [image, setImage] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(type === 'STANDARD' ? productUpdateStandardSchema : productUpdateSpecialSchema),
    defaultValues: {
      name: '',
      costPrice: 0,
      sellingPrice: 0,
      variations: [],
    },
  });
  const {
    watch,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods;

  const onSubmit = (data) => {
    console.log('data: ', data);
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
    dispatch(updateProductAction({ id: routeParams.id, data: productData })).then(({ payload, error }) => {
      setLoading(false);
      if (payload) {
        navigate('/dashboard/products');
      } else {
        toast.error(error.message);
      }
    });
  };

  useEffect(() => {
    if (routeParams.id) {
      dispatch(getProductAction(routeParams.id)).then(() => {
        setInitialLoading(false);
      });
    }
  }, [dispatch, routeParams.id]);
  useEffect(() => {
    if (product) {
      const { name, type, variations } = product;

      setType(type);
      setValue('name', name);

      if (type === 'STANDARD') {
        const { costPrice, sellingPrice, description } = variations[0];
        setValue('costPrice', costPrice);
        setValue('sellingPrice', sellingPrice);
        setValue('description', description || '');
      } else {
        variations.forEach((variation, index) => {
          setValue(`variations[${index}].name`, variation.name);
          setValue(`variations[${index}].costPrice`, variation.costPrice);
          setValue(`variations[${index}].sellingPrice`, variation.sellingPrice);
          setValue(`variations[${index}].description`, variation.description || '');
        });
      }
    }
  }, [setValue, product]);

  if (!product && initialLoading) {
    return (
      <Box className="w-full h-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className="w-full h-full flex flex-col">
        <PageHeader title="Create Product" hasBack={true} backTo="/dashboard/products" />
        <Box className="w-full h-full flex grow">
          <Typography variant="subHeader" className="text-center m-auto" color="secondary.light">
            Product not found, check the product id
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Form action="" method="patch" control={control} onSubmit={handleSubmit(onSubmit)}>
      <Box className="w-full h-full">
        <PageHeader title="Update Product" hasBack={true} backTo="/dashboard/products" />

        <Grid container rowSpacing={1} columnSpacing={2} className="px-4 mb-8">
          <Grid item xs={12}>
            <Input
              label="Product Name"
              placeHolder="Enter product name..."
              disabled={loading}
              required={false}
              error={!!errors.name}
              helperText={errors.name?.message}
              inputProps={{ ...register('name') }}
            />
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
            Product Image
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
          <img
            src={image ? URL.createObjectURL(image) : product.image}
            alt="product"
            className="max-w-[500px] w-full h-full aspect-[2/1] object-cover border border-dashed rounded-md p-2"
          />
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
            disabled={!isDirty || loading}
          >
            Update product
          </LoadingButton>
        </Stack>
      </Box>
    </Form>
  );
};

export default UpdateProductPage;
