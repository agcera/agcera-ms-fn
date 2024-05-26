import { Box, capitalize } from '@mui/material';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import MoreButton from '../../components/Table/MoreButton';
import StatusBadge from '../../components/Table/StatusBadge';
import StyledTable from '../../components/Table/StyledTable';
import DetailsTransactionModal from '../../components/transaction/DetailsTransactionModal';
import { getAllTransactionsAction, selectAllTransactions } from '../../redux/transactionsSlice';

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactions = useSelector(selectAllTransactions);
  const [transactionId, setTransactionId] = useState(null);

  const columns = [
    {
      field: 'store',
      headerName: 'Store',
      flex: 1,
      valueGetter: (params, row) => (row.store?.name ? capitalize(row.store?.name) : 'Deleted Store'),
      renderCell: (params) =>
        params.row.store?.name ? (
          capitalize(params.row.store.name)
        ) : (
          <span className="text-secondary">Deleted Store</span>
        ),
    },
    {
      field: 'user',
      headerName: 'Created by',
      flex: 1,
      valueGetter: (params, row) => (row.user?.name ? capitalize(row.user?.name) : 'Deleted User'),
      renderCell: (params) =>
        params.row.user?.name ? capitalize(params.row.user.name) : <span className="text-secondary">Deleted User</span>,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0,
      renderCell: (params) => (
        <StatusBadge
          className="min-w-[80px]"
          status={params.value}
          bg={params.value === 'INCOME' ? 'bg-green-500' : 'bg-red-500'}
          color={'white'}
        />
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      valueGetter: (params, row) => `${row.amount} MZN`,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 1,
      valueGetter: (params, row) => format(new Date(row.createdAt), 'do MMM yyyy'),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
      sortable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <MoreButton
            id={params.id}
            model={'transactions'}
            hasEdit={false}
            hasDetails={() => {
              setTransactionId(params.id);
            }}
          />
        );
      },
    },
  ];

  const handleCloseDetails = () => {
    setTransactionId(null);
  };

  const fetchData = useCallback(
    (query) => {
      if (query?.sort) {
        query.sort = Object.keys(query.sort).reduce((acc, key) => {
          switch (key) {
            case 'store':
              acc['store.name'] = query.sort[key];
              break;
            case 'user':
              acc['user.name'] = query.sort[key];
              break;
            default:
              acc[key] = query.sort[key];
          }
          return acc;
        }, {});
      }
      return dispatch(getAllTransactionsAction(query));
    },
    [dispatch]
  );

  return (
    <>
      <Box className="size-full flex flex-col">
        <PageHeader
          title="Transactions"
          hasGenerateReport={true}
          hasCreate={() => navigate('/dashboard/transactions/create')}
        />

        <StyledTable
          disableSearch={true}
          fetchData={fetchData}
          columns={columns}
          data={transactions}
          onRowClick={(row) => setTransactionId(row.id)}
        />
      </Box>

      <DetailsTransactionModal id={transactionId} open={!!transactionId} handleClose={handleCloseDetails} />
    </>
  );
};

export default TransactionsPage;
