import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { Menu, MenuItem, Sidebar as ProSidebar } from 'react-pro-sidebar';
import { tokens } from '../themeConfig';

import { GrTransaction } from 'react-icons/gr';
import { IoMenuOutline } from 'react-icons/io5';
import { MdOutlineHome, MdOutlinePeopleAlt, MdOutlineProductionQuantityLimits, MdOutlineStore } from 'react-icons/md';
import { RiExchangeDollarFill } from 'react-icons/ri';
import flowers from '../assets/flowers.jpg';
import logo1 from '../assets/logo1png.png';
import { Link } from 'react-router-dom';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.secondary }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');

  return (
    <Box
      sx={{
        '& .pro-sidebar-inner': {
          background: `${colors.primary} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparend !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 30px !important',
        },
        '& .pro-inner-item:hover': {
          color: '#868dfb !important',
        },
        '& .pro-menu-item.active': {
          color: '#6870fa !important',
        },
      }}
    >
      {/* USER  */}

      <ProSidebar collapsed={isCollapsed} style={{ height: '100vh' }}>
        <Menu iconShape="square">
          {/* menu and logo item */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <IoMenuOutline linedIcon /> : undefined}
            style={{
              margin: '10px 0 20px 0',
              color: colors.secondary,
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <IoMenuOutline sx={{ fontSize: '30px' }} />
                </IconButton>

                <img src={logo1} width="50%" />
              </Box>
            )}
          </MenuItem>

          {/* user proto and name */}

          {!isCollapsed && (
            <Box mb="25px">
              {/* the profile image for the user */}
              <Box display="flex" justifyContent="center" alignItems="center">
                <img alt="profile-user" width="100px" height="100px" src={flowers} />
              </Box>

              <Box textAlign="center">
                <Typography className="text-primary" color={colors.secondary} fontWeight="bold" sx={{ mt: '10px' }}>
                  User Name
                </Typography>
                <Typography className="text-primary" color={colors.text_light}>
                  Maputo 1k Shop
                </Typography>
              </Box>
            </Box>
          )}

          {/* menu items  */}
          <Box paddingLeft={isCollapsed ? undefined : '10px'}>
            <Item title="Dashboard" to="/" icon={<MdOutlineHome />} selected={selected} setSelected={setSelected} />
            <Item title="Stores" to="/stores" icon={<MdOutlineStore />} selected={selected} setSelected={setSelected} />
            <Item
              title="Products"
              to="/products"
              icon={<MdOutlineProductionQuantityLimits />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Sales"
              to="/sales"
              icon={<RiExchangeDollarFill />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Transactions"
              to="/transactions"
              icon={<GrTransaction />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Users"
              to="/users"
              icon={<MdOutlinePeopleAlt />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
