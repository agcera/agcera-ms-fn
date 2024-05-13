import { Box, Button, FormHelperText, Grid, IconButton, Stack, Typography } from '@mui/material';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import Input from '../Input';
import { MdDelete } from 'react-icons/md';

const Variations = ({ loading }) => {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: 'variations' });

  const addNewOption = () => {
    append({
      name: '',
      number: 1,
      description: '',
      costPrice: 0,
      sellingPrice: 0,
    });
  };

  return (
    <Box className="w-full">
      <Stack direction="row" spacing={2} className="justify-between items-end mb-4">
        <Typography variant="subHeader" className="font-medium">
          Product options <span className="text-secondary"> *</span>
        </Typography>
        <Button onClick={addNewOption} disabled={loading}>
          Add new options
        </Button>
      </Stack>
      <Box className="w-full flex flex-col gap-2">
        {fields.length === 0 && (
          <Typography variant="body1" color="secondary.light" className="text-center">
            No options added yet, please add atleast one option
          </Typography>
        )}
        {fields.map((field, index) => {
          return (
            <Box key={field.id} className="w-full flex gap-4 border border-dashed rounded-md p-4">
              <Grid rowSpacing={0.5} columnSpacing={1} container>
                <Grid item xs={12} sm={6} md={12}>
                  <Controller
                    disabled={loading}
                    control={control}
                    name={`variations.${index}.name`}
                    render={({ field, fieldState: { error } }) => (
                      <Input label="Name" error={!!error} helperText={error?.message} inputProps={{ ...field }} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    disabled={loading}
                    control={control}
                    name={`variations.${index}.number`}
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
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    disabled={loading}
                    control={control}
                    name={`variations.${index}.costPrice`}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        label="Cost Price"
                        error={!!error}
                        helperText={error?.message}
                        inputProps={{ type: 'number', ...field, inputProps: { step: '.01', min: 0 } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    disabled={loading}
                    control={control}
                    name={`variations.${index}.sellingPrice`}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        label="Selling Price"
                        error={!!error}
                        helperText={error?.message}
                        inputProps={{
                          type: 'number',
                          ...field,
                          inputProps: { step: '.01', min: watch('costPrice') },
                        }}
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <Controller
                    disabled={loading}
                    control={control}
                    name={`variations.${index}.description`}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        required={false}
                        label="description"
                        error={!!error}
                        helperText={error?.message}
                        inputProps={{ multiline: true, minRows: 2, ...field }}
                      />
                    )}
                  />
                </Grid> */}
              </Grid>

              <Box className="mt-5">
                <IconButton onClick={() => remove(field.id)} color="error" disabled={loading}>
                  <MdDelete size={30} />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box className="px-4 py-1">
        <VariationsError />
      </Box>
    </Box>
  );
};

export default Variations;

export const VariationsError = () => {
  const {
    formState: { errors },
  } = useFormContext();

  if (errors.variations?.root?.message) {
    return (
      <FormHelperText className="text-sm" error={true}>
        {errors.variations?.root?.message}
      </FormHelperText>
    );
  }
};
