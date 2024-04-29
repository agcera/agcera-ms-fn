import { Box, IconButton, useTheme } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { useContext } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import {
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdOutlineNotificationsNone,
  MdOutlinePersonOutline,
  MdOutlineSettingsSuggest,
} from 'react-icons/md';
import { ColorModeContext, tokens } from '../themeConfig';

function Topbar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-between" p={1} className="shadow-sm">
      {/* SEARCH BAR  */}
      <Box className="ml-[230px]" display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          {' '}
          <HiOutlineSearch />{' '}
        </IconButton>
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
          <MdOutlineSettingsSuggest />
        </IconButton>
        <IconButton>
          <MdOutlinePersonOutline />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Topbar;
