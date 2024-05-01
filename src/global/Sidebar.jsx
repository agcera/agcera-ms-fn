import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useState } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../themeConfig';
import { IoMenuOutline } from 'react-icons/io5';
import { MdAnalytics, MdOutlineStore, MdOutlineProductionQuantityLimits, MdOutlinePeopleAlt } from 'react-icons/md';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { GrTransaction } from 'react-icons/gr';
import { profile } from '../assets';

/* eslint-disable */
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.primary.main }}
      onClick={() => setSelected(title)}
      icon={icon}
      className="pr-2 text-sm"
    >
      <Typography variant="body2">{title}</Typography>
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
          background: `red !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'red !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 30px !important',
        },
        '& .pro-inner-item:hover': {
          color: 'red !important',
        },
        '& .pro-menu-item.active': {
          color: 'red !important',
        },
        zIndex: 100,
        top: 0,
        '@media (max-width:800px)': {
          position: 'fixed',
        },
      }}
    >
      {/* USER  */}

      <ProSidebar collapsed={isCollapsed} style={{ height: '100vh' }}>
        <Menu iconShape="square">
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
                <img alt="profile-user" className="w-[70px] h-[70px] rounded-full" src={profile} />
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
            <Item title="Dashboard" to="/" icon={<MdAnalytics />} selected={selected} setSelected={setSelected} />
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
