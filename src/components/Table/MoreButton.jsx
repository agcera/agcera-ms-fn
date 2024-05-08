import { MdMoreHoriz } from 'react-icons/md';
import { Box, Button, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { AiFillEdit } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa';
import { useTheme } from '@mui/material';
import { tokens } from '../../themeConfig';

function MoreButton({ id, model }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isActionGroupVisible, setIsActionGroupVisible] = useState(false);
  const actionGroup = useRef();

  const toggleActionGroup = () => {
    setIsActionGroupVisible(!isActionGroupVisible);
  };

  return (
    <Box className="absolute">
      <Button onClick={toggleActionGroup} variant="text" className="text-gray-500 hover:text-gray-700">
        <MdMoreHoriz />
      </Button>
      <Box
        ref={actionGroup}
        className={`absolute ${isActionGroupVisible ? 'block' : 'hidden'} shadow-md p-2 z-50 rounded-md top-0 left-16 flex-col`}
        sx={{ bgcolor: colors.highlight.main }}
      >
        <Typography
          className="w-full text-left flex hover:bg-white p-1 justify-start rounded-sm cursor-pointer mb-1 text-[12px] font-semibold text-gray-500"
          onClick={() => {
            console.log('view ' + id + ' in ' + model);
          }}
        >
          <FaEye />
          <span className="bg-none pr-1 ml-1 align-center">Profile </span>
        </Typography>

        <Typography
          className="w-full text-left flex hover:bg-white p-1 justify-start rounded-sm cursor-pointer mb-1 text-[12px] font-semibold text-gray-500"
          onClick={() => {
            console.log('edit ' + id + ' in ' + model);
          }}
        >
          <AiFillEdit />
          <span className="bg-none pr-1 ml-1 align-center">Edit </span>
        </Typography>
        <Typography
          className="w-full text-left flex hover:bg-white p-1 justify-start rounded-sm cursor-pointer mb-1 text-[12px] font-semibold text-gray-500"
          onClick={() => {
            console.log('delete ' + id + ' in ' + model);
          }}
        >
          <FaTrash />
          <span className="bg-none pr-1 ml-1 align-center">Delete </span>
        </Typography>
      </Box>
    </Box>
  );
}

export default MoreButton;
