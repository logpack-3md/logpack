// app/dashboard/sections/dashboard/default/AnalyticEcommerce.jsx
import { Stack, Typography } from '@mui/material';
import MainCard from '../../cards/MainCard';

export default function AnalyticEcommerce({ title, count, percentage, isLoss, color = 'primary', extra }) {
  return (
    <MainCard content={false}>
      <Stack spacing={0.5} sx={{ p: 2.5 }}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="700">
          {count}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="subtitle1"
            color={isLoss ? 'error.main' : 'success.main'}
            sx={{ fontWeight: 600 }}
          >
            {isLoss ? `-${percentage}%` : `+${percentage}%`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            vs. last month
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          You made an extra {extra} this year
        </Typography>
      </Stack>
    </MainCard>
  );
}