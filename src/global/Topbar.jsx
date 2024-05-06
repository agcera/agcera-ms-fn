import { Box, IconButton, useTheme } from '@mui/material';
import { useContext } from 'react';
import {
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdOutlineNotificationsNone,
  MdOutlinePersonOutline,
  // MdOutlineSettingsSuggest,
} from 'react-icons/md';
import { ColorModeContext } from '../themeConfig';
import { logo } from '../assets';

function Topbar() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box p={1} className="flex justify-between items-center shadow-sm bg-background w-[100%]">
      {/* SEARCH BAR  */}
      <Box className="w-28 h-max shrink-0 pl-4">
        <img src={logo} className="w-full" />
      </Box>

      {/* icons  */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
        </IconButton>
        <IconButton>
          {' '}
          <MdOutlineNotificationsNone />{' '}
        </IconButton>
        <IconButton>
          <MdOutlinePersonOutline />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Topbar;
