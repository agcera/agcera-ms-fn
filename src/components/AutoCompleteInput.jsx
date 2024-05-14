import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const AutoCompleteInput = ({
  label,
  placeHolder,
  className,
  helperText,
  error = false,
  disabled = false,
  required = true,
  inputProps = {},
  labelProps = {},
  value,
  onChange,
  inputValue,
  onInputChange,
  options,
  renderOption,
  getOptionLabel = (o) => o.label,
  ...otherProps
}) => {
  return (
    <Box disabled={disabled} className={clsx('w-full flex flex-col gap-1', className)} {...otherProps}>
      {label && (
        <Typography
          variant="body2"
          component="label"
          htmlFor={inputProps.name}
          disabled={disabled}
          className={clsx('font-medium', labelProps.className)}
          {...labelProps}
        >
          {label} {required && <span className="text-secondary"> *</span>}
        </Typography>
      )}
      <Autocomplete
        {...inputProps}
        value={value || null}
        onChange={onChange}
        inputValue={inputValue}
        onInputChange={onInputChange}
        disabled={disabled}
        options={options}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        renderInput={(params) => (
          <TextField
            {...params}
            disabled={disabled}
            placeholder={placeHolder}
            error={error}
            helperText={helperText}
            size="small"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'off',
            }}
          />
        )}
      />
    </Box>
  );
};

export default AutoCompleteInput;

AutoCompleteInput.propTypes = {
  label: PropTypes.string,
  placeHolder: PropTypes.string,
  className: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  inputProps: PropTypes.object,
  labelProps: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  renderOption: PropTypes.func,
  getOptionLabel: PropTypes.func,
};
