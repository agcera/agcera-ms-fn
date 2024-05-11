import { Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { tokens } from '../../themeConfig';
import { useTheme } from '@mui/material/styles';

function StyledTable({ data, columns, onRowClick, rowheight }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      className="px-3 pt-5 w-full h-full overflow-x-auto"
      sx={{
        [`& .${gridClasses.columnHeaders}`]: {
          color: 'red',
        },
        [`& .${gridClasses.root}`]: {
          minWidth: '700px',
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
          display: 'flex',
          alignItems: 'center',
          minWidth: 'max-content',
          width: '100%',
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
        autoPageSize={true}
        disableRowSelectionOnClick={!onRowClick}
        onRowClick={onRowClick}
        isRowSelectable={() => !!onRowClick}
        getRowHeight={() => rowheight}
      />
    </Box>
  );
}

export default StyledTable;
