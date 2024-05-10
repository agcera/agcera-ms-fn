import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const MultiSelect = ({
  options,
  label,
  className,
  helperText,
  error = false,
  disabled = false,
  required = true,
  inputProps = {},
  labelProps = {},
  ...otherProps
}) => {
  const handleChange = (event) => {
    if (!inputProps.onChange) return;
    const value = event.target.value;
    inputProps.onChange({ target: { value: typeof value === 'string' ? value.split(',') : value } });
  };

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
      <FormControl>
        <MuiSelect
          size="small"
          variant="outlined"
          id={inputProps.name}
          disabled={disabled}
          error={error}
          fullWidth
          multiple
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={options.find((o) => o.value === value)?.name || ''} />
              ))}
            </Box>
          )}
          {...inputProps}
          onChange={handleChange}
        >
          {options.map(({ name, value }) => {
            return (
              <MenuItem key={name} value={value}>
                <Checkbox checked={inputProps.value?.includes(value)} />
                <ListItemText primary={name} />
              </MenuItem>
            );
          })}
        </MuiSelect>
        {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  placeHolder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  labelProps: PropTypes.object,
  [PropTypes.string]: PropTypes.any,
};

export default MultiSelect;
