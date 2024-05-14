import { Box, IconButton, Typography, capitalize, useMediaQuery, useTheme } from '@mui/material';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { GrTransaction } from 'react-icons/gr';
import { IoMenuOutline } from 'react-icons/io5';
import { MdAnalytics, MdOutlinePeopleAlt, MdOutlineProductionQuantityLimits, MdOutlineStore } from 'react-icons/md';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { Menu, MenuItem, Sidebar as ProSidebar } from 'react-pro-sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { tokens } from '../themeConfig';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../redux/usersSlice';

/* eslint-disable */
const Item = ({ title, to, icon, className, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const active = useMemo(() => {
    if (location.pathname === '/dashboard/sales/create') return location.pathname === to;
    return location.pathname.startsWith(to);
  }, [to, location.pathname]);

  return (
    <MenuItem
      active={active}
      onClick={() => navigate(to)}
      icon={icon}
      className={clsx('pr-2 text-sm', className)}
      {...props}
    >
      <Typography variant="body2">{title}</Typography>
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useSelector(selectLoggedInUser);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  return (
    <Box
      className="absolute h-full sm:static z-50 bg-background"
      sx={{
        ['& ul']: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '10px',
          overflowY: 'auto',
        },
      }}
    >
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
          className="h-full"
        >
          {/* menu and logo item */}
          <Box className="inline-flex">
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
          </Box>

          {/* user proto and name */}

          {!isCollapsed && (
            <Box className="mb-5">
              {/* the profile image for the user */}
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  className="w-[70px] h-[70px] bg-slate-300 rounded-full object-cover"
                  src={user.image}
                />
              </Box>

              <Box textAlign="center">
                <Typography className="text-dark text-sm/[16px] font-semibold" sx={{ mt: '10px' }}>
                  {capitalize(user.name)}
                </Typography>
                <Typography className="text-primary font-medium" sx={{ color: colors.primary.main }} variant="info1">
                  Role: {capitalize(user.role)}
                </Typography>
                <Typography className="text-primary" sx={{ color: colors.primary.main }} variant="info1">
                  Store: {capitalize(user.store.name)}
                </Typography>
              </Box>
            </Box>
          )}

          {/* menu items  */}
          <Box paddingLeft={isCollapsed ? undefined : '10px'}>
            <Item title="Analytics" to="/dashboard/analytics" icon={<MdAnalytics />} />
            <Item title="Stores" to="/dashboard/stores" icon={<MdOutlineStore />} />
            <Item title="Products" to="/dashboard/products" icon={<MdOutlineProductionQuantityLimits />} />
            <Item title="Sales" to="/dashboard/sales" icon={<RiExchangeDollarFill />} />
            <Item title="Transactions" to="/dashboard/transactions" icon={<GrTransaction />} />
            <Item title="Users" to="/dashboard/users" icon={<MdOutlinePeopleAlt />} />
          </Box>
          <Box
            paddingLeft={isCollapsed ? undefined : '10px'}
            sx={{
              mt: 'auto',
              ['& .ps-menu-button']: {
                bgcolor: colors.specialBlue.main,
              },
            }}
          >
            <Item title="Sell" to="/dashboard/sales/create" icon={<RiExchangeDollarFill />} />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
