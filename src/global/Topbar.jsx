import { Box, Icon, IconButton, useTheme } from "@mui/material"
import { useContext } from "react";
import { ColorModeContext, tokens } from "../themeConfig";
import InputBase from "@mui/material/InputBase";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from 'react-icons/md';
import { MdOutlineNotificationsNone  } from "react-icons/md";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";


function Topbar() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext)

    return (
        <Box display="flex" justifyContent="space-between" p={2}>

            {/* SEARCH BAR  */}
            <Box display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius='3px'>

                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                <IconButton
                    type="button"
                    sx={{ p: 1 }}
                > <HiOutlineSearch /> </IconButton>
            </Box>

            {/* icons  */}
            <Box display='flex'>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? (
                        <MdOutlineDarkMode />
                    ) : (
                        <MdOutlineLightMode />
                    )}
                </IconButton>
                <IconButton> <MdOutlineNotificationsNone /> </IconButton>
            <IconButton><MdOutlineSettingsSuggest  /></IconButton>
            <IconButton><MdOutlinePersonOutline /></IconButton>
            </Box>

        </Box>
    )

}

export default Topbar;