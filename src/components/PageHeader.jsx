import { Typography, Box } from '@mui/material';
import { tokens } from '../themeConfig';
import { useTheme } from '@mui/system';
import ActionButton from './ActionButton';

const PageHeader = ({ title, hasGenerateReport, hasCreate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box className="flex justify-between items-center w-full p-4">
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
  );
};

export default PageHeader;
