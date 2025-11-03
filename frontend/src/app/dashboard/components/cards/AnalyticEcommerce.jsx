'use client';

import { Box, Chip, Stack, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import MainCard from './MainCard';

export default function AnalyticEcommerce({ title, count, percentage, isLoss, color = 'primary', extra }) {
  return (
    <MainCard content={false}>
      <Box sx={{ p: 2.25 }}>
        <Stack spacing={0.5}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" color="inherit">
            {count}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.75 }}>
          <Chip
            variant="combined"
            color={isLoss ? 'error' : color}
            icon={isLoss ? <TrendingDown /> : <TrendingUp />}
            label={`${percentage}%`}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {extra}
          </Typography>
        </Stack>
      </Box>
    </MainCard>
  );
}