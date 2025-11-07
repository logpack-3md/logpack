// app/dashboard/sections/dashboard/default/OrdersTable.jsx
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography } from '@mui/material';
import Dot from '../../../components/@extended/Dot';

const rows = [
  { tracking_no: 84564564, name: 'Camera Lens', fat: 40, carbs: 2, protein: 40570 },
  { tracking_no: 98764564, name: 'Laptop', fat: 300, carbs: 0, protein: 180139 },
  { tracking_no: 98756325, name: 'Mobile', fat: 355, carbs: 1, protein: 90989 },
  { tracking_no: 98652366, name: 'Handset', fat: 50, carbs: 1, protein: 10239 },
  { tracking_no: 13286564, name: 'Computer Accessories', fat: 100, carbs: 1, protein: 83348 },
  { tracking_no: 86739658, name: 'TV', fat: 99, carbs: 0, protein: 410780 },
  { tracking_no: 13256498, name: 'Keyboard', fat: 125, carbs: 2, protein: 70999 },
  { tracking_no: 98753263, name: 'Mouse', fat: 89, carbs: 2, protein: 10570 },
  { tracking_no: 98753275, name: 'Desktop', fat: 185, carbs: 1, protein: 98063 },
  { tracking_no: 98753291, name: 'Chair', fat: 100, carbs: 0, protein: 14001 }
];

function OrderStatus({ status }) {
  const map = { 0: ['warning', 'Pending'], 1: ['success', 'Approved'], 2: ['error', 'Rejected'] };
  const [color, title] = map[status] || ['primary', 'None'];
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function OrdersTable() {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tracking No.</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Total Order</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Total Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.tracking_no} hover>
              <TableCell><Link color="secondary" href="#">{row.tracking_no}</Link></TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell><OrderStatus status={row.carbs} /></TableCell>
              <TableCell align="right">${row.protein.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}