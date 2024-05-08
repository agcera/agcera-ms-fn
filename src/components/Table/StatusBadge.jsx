import { Box, Typography } from '@mui/material';

function StatusBadge({ status, bg, color }) {
  return (
    <Box className="overflow-hidden">
      <Typography
        className={`${bg} text-${color} rounded-2xl w-[40%] mt-3 text-center px-1 py-1 h-6 text-[12px] overflow-hidden`}
      >
        {' '}
        {status}
      </Typography>
    </Box>
  );
}

export default StatusBadge;
