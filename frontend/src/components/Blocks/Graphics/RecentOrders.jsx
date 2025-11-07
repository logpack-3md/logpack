'use client';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper } from '@mui/material';
import { _mock } from '../../../data/_mock';

const TABLE_HEAD = ['Tracking #', 'Product Name', 'Total Order', 'Status', 'Total Amount'];
const TABLE_DATA = [
  { id: '12356498', product: 'Keyboard', qty: 125, status: 'Rejected', amount: '$70.99' },
  { id: '12386564', product: 'Computer Accessories', qty: 100, status: 'Approved', amount: '$83.34' },
  { id: '84564564', product: 'Camera Lens', qty: 40, status: 'Rejected', amount: '$40.57' },
  { id: '86739558', product: 'TV', qty: 99, status: 'Pending', amount: '$410.78' },
  // Adicione mais 6 como na screenshot
  { id: '98652366', product: 'Handset', qty: 50, status: 'Approved', amount: '$10.29' },
  { id: '98752363', product: 'Mouse', qty: 89, status: 'Rejected', amount: '$10.57' },
  { id: '9875275', product: 'Desktop', qty: 185, status: 'Approved', amount: '$98.06' },
  { id: '9875291', product: 'Chair', qty: 100, status: 'Pending', amount: '$14.00' },
  { id: '9876325', product: 'Mobile', qty: 355, status: 'Approved', amount: '$90.98' },
  { id: '9874564', product: 'Laptop', qty: 300, status: 'Pending', amount: '$180.13' },
];

export default function RecentOrders() {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {TABLE_HEAD.map((head) => <TableCell key={head}>{head}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {TABLE_DATA.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.product}</TableCell>
              <TableCell>{row.qty}</TableCell>
              <TableCell>
                <Chip label={row.status} color={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'error' : 'warning'} size="small" />
              </TableCell>
              <TableCell>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}