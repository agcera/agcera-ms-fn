import { Typography, Box } from '@mui/material';
import { tokens } from '../themeConfig';
import { useTheme } from '@mui/system';
import ActionButton from './ActionButton';

const PageHeader = ({ title, hasGenerateReport, hasCreate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box className="flex mt-20 ml-20 md:ml-4 justify-between w-[100%] pr-2 md:pr-5">
      <Box>
<<<<<<< HEAD
        <Typography variant="header" className="text-center text-primary-light font-semibold">
=======
        <Typography variant="header" className="text-center text-primary font-semibold">
>>>>>>> 6cc2005 (dashboard correction)
          {title}
        </Typography>
      </Box>

      <Box className="flex gap-1 md:gap-10">
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
