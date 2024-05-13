import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { FaEye, FaTrash } from 'react-icons/fa';
import { MdMoreHoriz } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import DeleteProductModal from '../products/DeleteProductModal';

function MoreButton({ id, model, ...props }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const toggleActionGroup = (e) => {
    e.stopPropagation();
    setAnchorEl(e.target);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleDetails = () => {
    navigate(`/dashboard/${model}/${id}`);
    handleCloseMenu();
  };
  const handleEdit = () => {
    navigate(`/dashboard/${model}/${id}/update`);
    handleCloseMenu();
  };
  const handleDelete = () => {
    setDeleteOpen(true);
    handleCloseMenu();
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };

  return (
    <>
      <Box {...props}>
        <Button onClick={toggleActionGroup} variant="text" className="text-gray-500 hover:text-gray-700">
          <MdMoreHoriz />
        </Button>
      </Box>

      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
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

      {model === 'products' && <DeleteProductModal id={id} open={deleteOpen} handleClose={handleCloseDelete} />}
    </>
  );
}

export default MoreButton;
