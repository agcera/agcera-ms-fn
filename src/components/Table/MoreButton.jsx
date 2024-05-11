import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { FaEye, FaTrash } from 'react-icons/fa';
import { MdMoreHoriz } from 'react-icons/md';

function MoreButton({ id, model, ...props }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleActionGroup = (e) => {
    e.stopPropagation();
    setAnchorEl(e.target);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleDetails = (e) => {
    console.log(e, id, model);
    handleCloseMenu();
  };
  const handleEdit = (e) => {
    console.log(e, id, model);
    handleCloseMenu();
  };
  const handleDelete = (e) => {
    console.log(e, id, model);
    handleCloseMenu();
  };

  return (
    <>
      <Box {...props}>
        <Button onClick={toggleActionGroup} variant="text" className="text-gray-500 hover:text-gray-700">
          <MdMoreHoriz />
        </Button>
      </Box>

      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu} anchorPosition={{ bottom: 0 }}>
        <MenuItem onClick={handleDetails}>
          <FaEye className="mr-2" />
          Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <AiFillEdit className="mr-2" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <FaTrash className="mr-2" />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

export default MoreButton;
