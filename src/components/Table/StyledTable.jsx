import { Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { tokens } from '../../themeConfig';
import { useTheme } from '@mui/material/styles';

function StyledTable({ data, columns, onRowClick, rowheight }) {
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
          // cell height
          [`& .${gridClasses.cell}`]: {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            minHeight: 'auto',
          },
          [`& .${gridClasses.row}`]: {
            '&:hover': {
              backgroundColor: colors.text_light.main,
              cursor: onRowClick ? 'pointer' : 'default',
            },
          },
        }}
      >
        <DataGrid
          className="overflow-x-auto"
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick={!onRowClick}
          onRowClick={onRowClick}
          isRowSelectable={() => !!onRowClick}
          getRowHeight={() => rowheight}
        />
      </Box>
    </Box>
  );
}

export default StyledTable;
