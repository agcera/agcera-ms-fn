import { Box, TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Input = ({
  label,
  placeHolder,
  className,
  helperText,
  error = false,
  disabled = false,
  inputProps = {},
  labelProps = {},
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
          {label} <span className="text-secondary"> *</span>
        </Typography>
      )}
      <TextField
        size="small"
        variant="outlined"
        id={inputProps.name}
        placeholder={placeHolder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        fullWidth
        {...inputProps}
      />
    </Box>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  placeHolder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  labelProps: PropTypes.object,
  [PropTypes.string]: PropTypes.any,
};

export default Input;
