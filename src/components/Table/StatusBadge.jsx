import { Typography } from '@mui/material';
import clsx from 'clsx';

function StatusBadge({ className, status, bg, color, ...props }) {
  return (
    <Typography
      className={clsx(
        `${bg} text-${color} rounded-2xl w-[40%] text-center px-3 py-1 h-6 min-w-max text-[12px] text-ellipsis`,
        className
      )}
      {...props}
    >
      {' '}
      {status}
    </Typography>
  );
}

export default StatusBadge;
