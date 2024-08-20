import { Box, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
  gridClasses,
} from '@mui/x-data-grid';
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { tokens } from '../../themeConfig';
import Select from '../Select';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPartialStoresAction, selectAllStores } from '../../redux/storesSlice';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../ActionButton';

const CustomToolbar = memo(function CustomToolbar({
  disableSearch,
  enableStoreSelector,
  setStoreId,
  storeId,
  enableSecurity,
}) {
  const dispatch = useDispatch();

  const stores = useSelector(selectAllStores);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPartialStoresAction());
  }, [dispatch]);

  return (
    <GridToolbarContainer className="flex flex-row gap-2 justify-between mb-1">
      <Box>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
        {enableSecurity && (
          <ActionButton
            bg={'#E6EEF5'}
            content={'Security'}
            className={'ml-2'}
            onclick={() => navigate('/forgot-password')}
          />
        )}
      </Box>
      {!disableSearch && <GridToolbarQuickFilter />}

      {enableStoreSelector && (
        <Select
          label="Store"
          placeHolder="Select the Store"
          // disabled={loading}
          // error={!!errors.type}
          // helperText={errors.type?.message}
          inputProps={{
            onChange: (e) => setStoreId(e.target.value !== 'all' ? e.target.value : null),
            value: storeId || 'all',
          }}
          className="max-w-[200px]"
        >
          <MenuItem key={'all'} value={'all'}>
            {` All`}
          </MenuItem>
          {stores
            .filter((store) => store.name != 'expired')
            .map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {' '}
                {store.name}
              </MenuItem>
            ))}
        </Select>
      )}
    </GridToolbarContainer>
  );
});

const pageSizeOptions = [5, 10, 25, 50, 75, 100];

function StyledTable({
  data: fetchedData,
  columns,
  onRowClick,
  rowheight,
  fetchData,
  initPagination = {},
  disableSearch = false,
  minWidth,
  enableStoreSelector = false,
  enableSecurity = false,
}) {
  const [storeId, setStoreId] = useState(null);

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
      fetchData({ ...query, storeId }).then(({ payload, error }) => {
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
  }, [query, storeId]);
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
          minWidth: minWidth || '700px',
          width: '100%',
          minHeight: '200px',
          border: 'none',
        },
        [`& .${gridClasses.main}`]: {
          minWidth: minWidth || '700px',
          width: '100%',
        },
        // []:{},
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
          toolbar: { disableSearch, enableStoreSelector, enableSecurity, setStoreId, storeId },
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
