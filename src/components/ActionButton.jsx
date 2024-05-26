import { Button } from '@mui/material';
import clsx from 'clsx';

function ActionButton({ content, children, bg, color, onclick, className, ...props }) {
  return (
    <Button
      sx={{ textTransform: 'none' }}
      onClick={onclick}
      variant="contained"
      style={{ backgroundColor: bg, color: color }}
      className={clsx('text-[12px] text-gray-600 max-h-8 min-w-20', className)}
      {...props}
    >
      {content || children}
    </Button>
  );
}

export default ActionButton;
