import { useEffect } from 'react';
import { Box, Button, FormHelperText, Grid, IconButton, Stack, Typography, MenuItem } from '@mui/material';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import Input from '../Input';
import Select from '../Select';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsAction, selectAllProducts } from '../../redux/productsSlice';

const MixtureItems = ({ loading }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: 'items' });

  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);

  useEffect(() => {
    dispatch(getAllProductsAction({ limit: 200 }));
  }, [dispatch]);

  const addNewItem = () => {
    append({
      productId: '',
      number: 1,
    });
  };

  return (
    <Box className="w-full">
      <Stack direction="row" spacing={2} className="justify-between items-end mb-4">
        <Typography variant="subHeader" className="font-medium">
          Mixture items <span className="text-secondary"> *</span>
        </Typography>
        <Button onClick={addNewItem} disabled={loading}>
          Add item
        </Button>
      </Stack>
      <Box className="w-full flex flex-col gap-2">
        {fields.length === 0 && (
          <Typography variant="body1" color="secondary.light" className="text-center">
            No items added yet, please add at least one item
          </Typography>
        )}
        {fields.map((field, index) => (
          <Box key={field.id} className="w-full flex gap-4 border border-dashed rounded-md p-4">
            <Grid rowSpacing={0.5} columnSpacing={1} container>
              <Grid item xs={12} sm={6} md={12}>
                <Controller
                  disabled={loading}
                  control={control}
                  name={`items.${index}.productId`}
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      label="Product"
                      placeHolder="Select a product"
                      error={!!error}
                      helperText={error?.message}
                      inputProps={{ ...field }}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  disabled={loading}
                  control={control}
                  name={`items.${index}.number`}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      label="Number of products"
                      error={!!error}
                      helperText={error?.message}
                      inputProps={{
                        type: 'number',
                        ...field,
                        inputProps: { min: 1 },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box className="mt-5">
              <IconButton onClick={() => remove(index)} color="error" disabled={loading}>
                <MdDelete size={30} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
      <Box className="px-4 py-1">
        <MixtureItemsError />
      </Box>
    </Box>
  );
};

export default MixtureItems;

export const MixtureItemsError = () => {
  const {
    formState: { errors },
  } = useFormContext();

  if (errors.items?.root?.message) {
    return (
      <FormHelperText className="text-sm" error={true}>
        {errors.items?.root?.message}
      </FormHelperText>
    );
  }
  return null;
};
