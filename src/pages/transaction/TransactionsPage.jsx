import { Box, capitalize } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import MoreButton from '../../components/Table/MoreButton';
import StatusBadge from '../../components/Table/StatusBadge';
import StyledTable from '../../components/Table/StyledTable';
import { getAllTransactions, selectAllTransactions } from '../../redux/transactionsSlice';
import DetailsTransactionModal from '../../components/transaction/DetailsTransactionModal';

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectAllTransactions);
  const [transactionId, setTransactionId] = useState(null);

  const columns = [
    { field: 'store', headerName: 'Store', flex: 1, renderCell: (params) => capitalize(params.value.name) },
    { field: 'user', headerName: 'Created by', flex: 1, renderCell: (params) => capitalize(params.value.name) },
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
      renderCell: (params) => `${params.value} MZN`,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 1,
      renderCell: (params) => format(new Date(params.value), 'do MMM yyyy'),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0,
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

  useEffect(() => {
    dispatch(getAllTransactions({}));
  }, [dispatch]);

  return (
    <>
      <Box className="size-full flex flex-col">
        <PageHeader
          title="Transactions"
          hasGenerateReport={true}
          hasCreate={() => {
            console.log('Create transactions');
          }}
        />

        <StyledTable columns={columns} data={transactions} />
      </Box>

      <DetailsTransactionModal id={transactionId} open={!!transactionId} handleClose={handleCloseDetails} />
    </>
  );
};

export default TransactionsPage;
