import { Box, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import clsx from 'clsx';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const CustomTableCell = ({ children, className, ...props }) => {
  return (
    <TableCell className={clsx('m-0 p-0 border-dashed border-t border-b', className)} {...props}>
      {children}
    </TableCell>
  );
};

const SelectCombosRow = memo(function SelectCombosRow({ field, loading, handleRemove, combo, onQuantityChange }) {
  const { setValue } = useFormContext();

  const handleDecrement = (field) => {
    if (field[1] <= 1) return;
    setValue(`combos.${field[0]}`, field[1] - 1);
    onQuantityChange();
  };
  const handleIncrement = (field) => {
    setValue(`combos.${field[0]}`, field[1] + 1);
    onQuantityChange();
  };

  return (
    <TableRow key={field[0]}>
      <CustomTableCell colSpan={3} className="border-l pl-4 rounded-l-md">
        <Typography variant="body1" className="font-medium">
          {combo.label}
        </Typography>
      </CustomTableCell>

      <CustomTableCell align="center">
        <Box className="shrink-0 w-max flex items-center gap-2">
          <IconButton disabled={loading} size="small" onClick={() => handleDecrement(field)}>
            <FaMinus />
          </IconButton>
          <Typography>{field[1]}</Typography>
          <IconButton disabled={loading} size="small" onClick={() => handleIncrement(field)}>
            <FaPlus />
          </IconButton>
        </Box>
      </CustomTableCell>

      <CustomTableCell align="center">
        <Typography>Total: {field[1] * combo.sellingPrice} MZN</Typography>
      </CustomTableCell>

      <CustomTableCell align="center">
        <Typography>Virtual item</Typography>
      </CustomTableCell>

      <CustomTableCell align="right" className="border-r pr-4 rounded-r-md">
        <IconButton disabled={loading} onClick={() => handleRemove(field[0])} color="error">
          <MdDelete />
        </IconButton>
      </CustomTableCell>
    </TableRow>
  );
});

export default SelectCombosRow;
