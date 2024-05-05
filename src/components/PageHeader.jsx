import { Typography, Box, Stack, Button } from '@mui/material';
import { tokens } from '../themeConfig';
import { useTheme } from '@mui/system';
import ActionButton from './ActionButton';
import { Link } from 'react-router-dom';
import { PiSkipBackLight } from 'react-icons/pi';

const PageHeader = ({ title, hasGenerateReport, hasCreate, hasBack, backTo }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box className="w-full p-4">
      {hasBack && (
        <Stack direction="row" className="mb-4">
          <Button LinkComponent={Link} to={backTo || -1} variant="back" color="black">
            <Box className="flex gap-[1px] items-center">
              <PiSkipBackLight />
              <Typography>back</Typography>
            </Box>
          </Button>
        </Stack>
      )}
      <Box className="flex justify-between items-center w-full">
        <Box>
          <Typography variant="header" sx={{ color: colors.primary.light }} className="text-center font-semibold">
            {title}
          </Typography>
        </Box>

        <Box className="flex gap-2">
          {/* button for generate report and create new record  */}
          {hasGenerateReport && (
            <ActionButton
              content="Generate Report"
              onclick={hasGenerateReport}
              bg={colors.blue.main}
              color={colors.text_dark.main}
            />
          )}

          {hasCreate && (
            <ActionButton content="Create" onclick={hasCreate} bg={colors.blue.main} color={colors.text_dark.main} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;
