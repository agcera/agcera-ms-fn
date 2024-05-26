import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
  gridClasses,
} from '@mui/x-data-grid';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { tokens } from '../../themeConfig';

function CustomToolbar({ disableSearch }) {
  return (
    <GridToolbarContainer className="flex flex-row gap-2 justify-between mb-1">
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      {!disableSearch && <GridToolbarQuickFilter />}
    </GridToolbarContainer>
  );
}

const pageSizeOptions = [5, 10, 25, 50, 75, 100];

function StyledTable({
  data: fetchedData,
  columns,
  onRowClick,
  rowheight,
  fetchData,
  initPagination = {},
  disableSearch = false,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState({
    skip: initPagination.skip || 0,
    limit: initPagination.limit || 25,
    sort: null,
    ...(!disableSearch ? { search: null } : {}),
  });
  const lagSearchRef = useRef({ timeout: null, values: null });
  const [loading, setLoading] = useState(false);
  const totalDataRef = useRef(0);
  const mode = fetchData ? 'server' : 'client';

  const pagination = useMemo(() => {
    return {
      page: query.skip / query.limit,
      pageSize: query.limit,
    };
  }, [query.skip, query.limit]);

  const handlePagination = (paginationModel) => {
    setQuery({
      ...query,
      skip: paginationModel.page * paginationModel.pageSize,
      limit: paginationModel.pageSize,
    });
  };

  const onFilterModelChange = (values) => {
    lagSearchRef.values = values;
    lagSearchRef.current.timeout = setTimeout(() => {
      clearTimeout(lagSearchRef.current.timeout);
      const search = lagSearchRef.values.quickFilterValues.join(' ').trim();
      setQuery({ ...query, search: search || null });
    }, 500);
  };
  const onSortModelChange = (values) => {
    setQuery({
      ...query,
      sort: values.reduce((acc, { field, sort }) => {
        if (!acc) acc = {};
        acc[field] = sort;
        return acc;
      }, null),
    });
  };

  useEffect(() => {
    if (fetchData) {
      setLoading(true);
      fetchData(query).then(({ payload, error }) => {
        setLoading(false);
        if (payload) {
          const dataKeys = Object.keys(payload.data);
          dataKeys.forEach((key) => {
            if (key === 'total') {
              totalDataRef.current = payload.data.total;
            } else {
              setData(payload.data[key]);
            }
          });
        } else {
          toast.error(error.message);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  useLayoutEffect(() => {
    if (!fetchData && fetchedData) {
      setData(fetchedData);
    }
  }, [fetchData, fetchedData]);

  return (
    <Box
      className="px-3 pt-2 w-full h-full overflow-x-auto"
      sx={{
        [`& .${gridClasses.columnHeaders}`]: {
          color: 'red',
        },
        [`& .${gridClasses.root}`]: {
          minWidth: '700px',
          minHeight: '200px',
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
        loading={loading}
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel: pagination } }}
        paginationMode={mode}
        rowCount={fetchData ? totalDataRef.current : undefined}
        paginationModel={pagination}
        onPaginationModelChange={handlePagination}
        pageSizeOptions={pageSizeOptions}
        disableRowSelectionOnClick={!onRowClick}
        onRowClick={typeof onRowClick === 'function' ? onRowClick : undefined}
        isRowSelectable={() => !!onRowClick}
        getRowHeight={() => rowheight}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        filterMode={mode}
        onFilterModelChange={onFilterModelChange}
        sortingMode={mode}
        onSortModelChange={onSortModelChange}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: { disableSearch },
          baseButton: {
            sx: {
              variant: 'contained',
              bgcolor: colors.blue.main,
              color: colors.text_dark.main,
              ['&:hover']: {
                bgcolor: colors.blue.main,
              },
            },
            className: 'text-dark text-[12px] text-gray-600 max-h-8 min-w-20',
          },
        }}
      />
    </Box>
  );
}

export default StyledTable;
