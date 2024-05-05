import { Box, FormHelperText, Select as MuiSelect, Typography } from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Select = ({
  label,
  placeHolder,
  className,
  helperText,
  error = false,
  disabled = false,
  required = true,
  inputProps = {},
  labelProps = {},
  children,
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
      <MuiSelect
        size="small"
        variant="outlined"
        id={inputProps.name}
        placeholder={placeHolder}
        disabled={disabled}
        error={error}
        fullWidth
        {...inputProps}
      >
        {children}
      </MuiSelect>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </Box>
  );
};

Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  placeHolder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  labelProps: PropTypes.object,
  [PropTypes.string]: PropTypes.any,
};

export default Select;
