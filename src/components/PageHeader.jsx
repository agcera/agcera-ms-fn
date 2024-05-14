import { Typography, Box, Stack, Button } from '@mui/material';
import { tokens } from '../themeConfig';
import { useTheme } from '@mui/system';
import ActionButton from './ActionButton';
import { Link, useNavigate } from 'react-router-dom';
import { PiSkipBackLight } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../redux/usersSlice';

const PageHeader = ({ title, hasGenerateReport, hasCreate, hasUpdate, hasDelete, hasBack, backTo, otherActions }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector(selectLoggedInUser);

  const handleGenerateReport = () => {
    navigate('/dashboard/report');
  };

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
          {user.role !== 'user' && hasGenerateReport && (
            <ActionButton
              content="Generate Report"
              onclick={handleGenerateReport}
              bg={colors.blue.main}
              color={colors.text_dark.main}
            />
          )}

          {hasCreate && (
            <ActionButton content="Create" onclick={hasCreate} bg={colors.blue.main} color={colors.text_dark.main} />
          )}
          {hasUpdate && (
            <ActionButton content="Update" onclick={hasUpdate} bg={colors.blue.main} color={colors.text_dark.main} />
          )}
          {hasDelete && (
            <ActionButton
              content="Delete"
              onclick={hasDelete}
              bg={colors.secondary.main}
              color={colors.text_light.main}
            />
          )}
          {otherActions}
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;
