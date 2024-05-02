import { Box, LinearProgress, Typography } from '@mui/material';
import clsx from 'clsx';

const Loader = ({ className, ...props }) => {
  return (
    <Box className={clsx('flex flex-col gap-2 items-center justify-center w-max', className)} {...props}>
      <Typography variant="header" className="font-medium" color="primary.light">
        Loading...
      </Typography>
      <LinearProgress className="w-[200%]" />
    </Box>
  );
};

export default Loader;
