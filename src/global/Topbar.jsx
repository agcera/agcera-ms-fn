import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { MdLogout, MdOutlinePersonOutline, MdPersonOutline } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutAction } from '../redux/usersSlice';
import { resetStoreAction } from '../redux/store';

function Topbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    !logoutLoading && setAnchorEl(null);
  };
  const handleOpen = (e) => {
    !logoutLoading && setAnchorEl(e.target);
  };

  const handleProfile = () => {
    !logoutLoading && navigate('/dashboard/profile');
    handleClose();
  };
  const handleLogout = () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    dispatch(logoutAction()).then(({ error }) => {
      setLogoutLoading(true);
      if (!error) {
        dispatch(resetStoreAction());
      } else {
        toast.error(error.message);
      }
    });
    handleClose();
  };

  return (
    <>
      <Box p={1} className="flex justify-between items-center shadow-sm bg-background w-[100%]">
        {/* SEARCH BAR  */}
        <Box className="w-28 h-max shrink-0 pl-4">
          <img src="/images/logo_cropped.png" alt="logo" className="w-full" />
        </Box>

        {/* icons  */}
        <Box display="flex">
          {/* <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
          </IconButton> */}
          {/* <IconButton>
            {' '}
            <MdOutlineNotificationsNone />{' '}
          </IconButton> */}
          <IconButton disabled={logoutLoading} onClick={handleOpen}>
            <MdOutlinePersonOutline />
          </IconButton>
        </Box>
      </Box>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        // transformOrigin={{
        //   vertical: 'top',
        //   horizontal: 'right',
        // }}
        onClose={handleClose}
      >
        <MenuItem disabled={logoutLoading} onClick={handleProfile}>
          <MdPersonOutline className="mr-2" />
          Profile
        </MenuItem>
        <MenuItem disabled={logoutLoading} onClick={handleLogout}>
          <MdLogout className="mr-2" />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Topbar;
