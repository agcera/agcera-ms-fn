import { Box } from '@mui/material';

const HeaderUnderline = () => {
  return (
    <Box className="shrink-0 max-w-[100px] w-full flex items-center">
      <Box className="grow h-[2px] rounded-l-full bg-black" />
      <Box className="shrink-0 w-[11px] h-[11px] rounded-full bg-transparent border-[1px] border-black flex">
        <Box className="w-[5px] h-[5px] rounded-full bg-primary m-auto" />
      </Box>
      <Box className="grow h-[2px] rounded-r-full bg-black" />
    </Box>
  );
};

export default HeaderUnderline;
