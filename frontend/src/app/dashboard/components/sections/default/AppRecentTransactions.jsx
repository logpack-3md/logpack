'use client';

import { Box, Card, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'amount', headerName: 'Amount', width: 110 },
  { field: 'status', headerName: 'Status', width: 120 }
];

const rows = [
  { id: 1, name: 'Jon Snow', amount: '$1,200', status: 'Approved' },
  { id: 2, name: 'Cersei Lannister', amount: '$2,300', status: 'Pending' },
  { id: 3, name: 'Jaime Lannister', amount: '$1,500', status: 'Rejected' }
];

export default function AppRecentTransactions() {
  return (
    <Card>
      <CardHeader title="Recent Transactions" sx={{ mb: 3 }} />
      <DataGrid rows={rows} columns={columns} initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} pageSizeOptions={[5]} />
    </Card>
  );
}