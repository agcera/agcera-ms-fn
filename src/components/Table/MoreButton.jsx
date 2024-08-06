import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { FaEye, FaTrash } from 'react-icons/fa';
import { MdMoreHoriz } from 'react-icons/md';
import { RiRefund2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import DeleteProductModal from '../products/DeleteProductModal';
import DeleteStoreModal from '../store/DeleteStoreModal';
import DeleteSaleModal from '../sale/RefundSaleModal';
import DeleteUserModal from '../user/DeleteUserModal';
import RefundSaleModal from '../sale/RefundSaleModal';

function MoreButton({ id, model, hasDelete = false, hasRefund = false, hasDetails = true, hasEdit = true, ...props }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);

  const toggleActionGroup = (e) => {
    e.stopPropagation();
    setAnchorEl(e.target);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleDetails = (e) => {
    if (typeof hasDetails === 'function') {
      hasDetails(e);
    } else {
      navigate(`/dashboard/${model}/${id}`);
    }
    handleCloseMenu();
  };
  const handleEdit = (e) => {
    if (typeof hasEdit === 'function') {
      hasEdit(e);
    } else {
      navigate(`/dashboard/${model}/${id}/update`);
    }
    handleCloseMenu();
  };
  const handleDelete = () => {
    setDeleteOpen(true);
    handleCloseMenu();
  };
  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };

  const handleRefund = () => {
    setRefundOpen(true);
    handleCloseMenu();
  };
  const handleCloseRefund = () => {
    setRefundOpen(false);
  };

  return (
    <>
      <Box {...props}>
        <Button onClick={toggleActionGroup} variant="text" className="text-gray-500 hover:text-gray-700">
          <MdMoreHoriz />
        </Button>
      </Box>

      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
        {hasDetails && (
          <MenuItem onClick={handleDetails}>
            <FaEye className="mr-2" />
            Details
          </MenuItem>
        )}
        {hasEdit && (
          <MenuItem onClick={handleEdit}>
            <AiFillEdit className="mr-2" />
            Edit
          </MenuItem>
        )}
        {hasRefund && (
          <MenuItem onClick={handleRefund}>
            <RiRefund2Line size="18" className="mr-2" />
            Refund
          </MenuItem>
        )}
        {hasDelete && (
          <MenuItem onClick={handleDelete}>
            <FaTrash className="mr-2" />
            Delete
          </MenuItem>
        )}
      </Menu>

      {hasDelete && [
        model === 'products' && (
          <DeleteProductModal key={model} id={id} open={deleteOpen} handleClose={handleCloseDelete} />
        ),
        model === 'stores' && (
          <DeleteStoreModal key={model} id={id} open={deleteOpen} handleClose={handleCloseDelete} />
        ),
        model === 'sales' && <DeleteSaleModal key={model} id={id} open={deleteOpen} handleClose={handleCloseDelete} />,
        model === 'users' && <DeleteUserModal key={model} id={id} open={deleteOpen} handleClose={handleCloseDelete} />,
      ]}
      {hasRefund && <RefundSaleModal id={id} open={refundOpen} handleClose={handleCloseRefund} />}
    </>
  );
}

export default MoreButton;
