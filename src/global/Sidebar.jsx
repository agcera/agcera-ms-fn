import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { GrTransaction } from 'react-icons/gr';
import { IoMenuOutline } from 'react-icons/io5';
import { MdAnalytics, MdOutlinePeopleAlt, MdOutlineProductionQuantityLimits, MdOutlineStore } from 'react-icons/md';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { Menu, MenuItem, Sidebar as ProSidebar } from 'react-pro-sidebar';
import { profile } from '../assets';
import { tokens } from '../themeConfig';
import { useLocation, useNavigate } from 'react-router-dom';

/* eslint-disable */
const Item = ({ title, to, icon }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MenuItem active={location.pathname === to} onClick={() => navigate(to)} icon={icon} className="pr-2 text-sm">
      <Typography variant="body2">{title}</Typography>
    </MenuItem>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box>
      {/* USER  */}
      <ProSidebar collapsed={isCollapsed} style={{ height: '100vh' }}>
        <Menu
          iconShape="square"
          menuItemStyles={{
            button: {
              color: colors.primary.main,
              ['&.ps-active']: {
                backgroundColor: colors.primary.light,
                color: colors.text_light.main,
              },
            },
          }}
          className="mb-4"
        >
          {/* menu and logo item */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <IoMenuOutline className="text-lg" /> : undefined}
            style={{
              margin: '10px 0 20px 0',
              color: colors.primary.main,
              // borderBottom: `1px solid ${colors.primary.main}`,
              shadow: '20px 20px red',
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <IoMenuOutline sx={{ fontSize: '30px' }} />
                </IconButton>

                {/* <img src={logo} width="50%" /> */}
              </Box>
            )}
          </MenuItem>

          {/* user proto and name */}

          {!isCollapsed && (
            <Box className="mb-5">
              {/* the profile image for the user */}
              <Box display="flex" justifyContent="center" alignItems="center">
                <img alt="profile-user" className="w-[70px] h-[70px] rounded-full object-cover" src={profile} />
              </Box>

              <Box textAlign="center">
                <Typography className="text-dark text-sm/[16px] font-semibold" sx={{ mt: '10px' }}>
                  Shema Alain
                </Typography>
                <Typography className="text-primary" sx={{ color: colors.primary.main }} variant="info1">
                  Maputo 9P
                </Typography>
              </Box>
            </Box>
          )}

          {/* menu items  */}
          <Box paddingLeft={isCollapsed ? undefined : '10px'}>
            <Item title="Analytics" to="/dashboard" icon={<MdAnalytics />} />
            <Item title="Stores" to="/dashboard/stores" icon={<MdOutlineStore />} />
            <Item title="Products" to="/dashboard/products" icon={<MdOutlineProductionQuantityLimits />} />
            <Item title="Sales" to="/dashboard/sales" icon={<RiExchangeDollarFill />} />
            <Item title="Transactions" to="/dashboard/transactions" icon={<GrTransaction />} />
            <Item title="Users" to="/dashboard/users" icon={<MdOutlinePeopleAlt />} />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
