// app/dashboard/components/@extended/Dot.jsx
import { Box } from '@mui/material';

export default function Dot({ color = 'primary', size = 8 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: `${color}.main`,
        display: 'inline-block'
      }}
    />
  );
}