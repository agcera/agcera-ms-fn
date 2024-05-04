import { Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { tokens } from '../themeConfig';
import { useTheme } from '@mui/material/styles';

function StyledTable({ users, columns }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box>
      <Box
        className="mr-3 mt-5"
        sx={{
          [`& .${gridClasses.columnHeaders}`]: {
            color: 'red',
          },
          [`& .${gridClasses.root}`]: {
            border: 'none',
          },
          [`& .${gridClasses.footerContainer}`]: {
            backgroundColor: colors.text_light.main,
          },
          // table header row
          [`& .${gridClasses.columnHeader}`]: {
            background: colors.highlight.main,
            color: colors.text_light,
          },
          // header icons
          [`& .${gridClasses.iconSeparator}`]: {
            color: colors.text_light.main,
          },
        }}
      >
        <DataGrid
          className="overflow-x-auto"
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          isRowSelectable={() => false}
          // scroll overflow for a cell
        />
      </Box>
    </Box>
  );
}

export default StyledTable;
