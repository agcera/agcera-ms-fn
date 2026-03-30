import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/Input';
import LoadingButton from '../../components/LoadingButton';
import PageHeader from '../../components/PageHeader';
import MixtureItems from '../../components/mixtures/MixtureItems';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { getMixtureAction, selectMixtureById, updateMixtureAction } from '../../redux/mixturesSlice';
import { mixtureUpdateSchema } from '../../validations/mixtures.validation';

const UpdateMixturePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();
  const mixture = useSelector(selectMixtureById(routeParams.id));
  const [image, setImage] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(mixtureUpdateSchema),
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
    reset,
    setValue,
    formState: { errors, isDirty },
  } = methods;

  const onSubmit = (data) => {
    const mixtureData = {
      name: data.name,
      costPrice: data.costPrice,
      sellingPrice: data.sellingPrice,
      items: data.items,
      image,
    };
    setLoading(true);
    dispatch(updateMixtureAction({ id: routeParams.id, data: mixtureData })).then(({ payload, error }) => {
      setLoading(false);
      if (payload) {
        navigate('/dashboard/mixtures');
      } else {
        toast.error(error.message);
      }
    });
  };

  useEffect(() => {
    if (routeParams.id) {
      dispatch(getMixtureAction(routeParams.id)).then(() => {
        setInitialLoading(false);
      });
    }
  }, [dispatch, routeParams.id]);

  useEffect(() => {
    if (mixture) {
      const { name, costPrice, sellingPrice, items } = mixture;
      reset({
        name,
        costPrice,
        sellingPrice,
        items: (items || []).map((item) => ({
          productId: item.productId,
          number: item.number,
        })),
      });
    }
  }, [reset, mixture]);

  if (!mixture && initialLoading) {
    return (
      <Box className="w-full h-full flex">
        <Loader className="m-auto" />
      </Box>
    );
  }

  if (!mixture) {
    return (
      <Box className="w-full h-full flex flex-col">
        <PageHeader title="Update Mixture" hasBack={true} backTo="/dashboard/mixtures" />
        <Box className="w-full h-full flex grow">
          <Typography variant="subHeader" className="text-center m-auto" color="secondary.light">
            Mixture not found, check the mixture id
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <form method="patch" action="" onSubmit={handleSubmit(onSubmit)}>
        <Box className="w-full h-full">
          <PageHeader title="Update Mixture" hasBack={true} backTo="/dashboard/mixtures" />

          <Grid container rowSpacing={1} columnSpacing={2} className="px-4 mb-8">
            <Grid item xs={12} md={6}>
              <Input
                label="Mixture Name"
                placeHolder="Enter mixture name..."
                disabled={loading}
                required={false}
                error={!!errors.name}
                helperText={errors.name?.message}
                inputProps={{ ...register('name') }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Cost Price"
                placeHolder="Enter mixture cost price..."
                disabled={loading}
                error={!!errors.costPrice}
                helperText={errors.costPrice?.message}
                inputProps={{ type: 'number', ...register('costPrice'), inputProps: { step: '.01', min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Selling Price"
                placeHolder="Enter mixture selling price..."
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
            <MixtureItems loading={loading} />
          </Box>

          <Box className="flex flex-col px-4 mb-4 gap-2">
            <Typography variant="subHeader" component="label" htmlFor="image" className="font-medium">
              Mixture Image
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
              src={image ? URL.createObjectURL(image) : mixture.image}
              alt="mixture"
              className="max-w-[500px] w-full h-full aspect-[2/1] object-cover border border-dashed rounded-md p-2"
            />
          </Box>

          <Stack direction="row-reverse" spacing={2} className="px-4 mb-4">
            <Button
              LinkComponent={Link}
              to="/dashboard/mixtures"
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
              Update mixture
            </LoadingButton>
          </Stack>
        </Box>
      </form>
    </FormProvider>
  );
};

export default UpdateMixturePage;
