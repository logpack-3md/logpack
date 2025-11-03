'use client';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

export default function OrdersTable() {
  const rows = [
    { id: '#1244', customer: 'John Doe', date: '2 Aug, 2025', status: 'Paid', amount: '$450' },
    { id: '#1243', customer: 'Jane Smith', date: '1 Aug, 2025', status: 'Pending', amount: '$320' },
    { id: '#1242', customer: 'Mike Johnson', date: '31 Jul, 2025', status: 'Shipped', amount: '$680' },
  ];

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>
                <Chip label={row.status} color={row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'primary'} size="small" />
              </TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}