// app/dashboard/sections/dashboard/default/SalesChart.jsx
'use client';

import { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel, FormGroup, Stack, Typography, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import MainCard from '../../cards/MainCard';

export default function SalesChart() {
  const theme = useTheme();

  const [showIncome, setShowIncome] = useState(true);
  const [showCostOfSales, setShowCostOfSales] = useState(true);

  const handleIncomeChange = () => setShowIncome(!showIncome);
  const handleCostOfSalesChange = () => setShowCostOfSales(!showCostOfSales);

  const valueFormatter = (value) => `$ ${value} Thousands`;

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const incomeData = [180, 90, 135, 114, 120, 145, 170, 200, 170, 230, 210, 180];
  const costData = [120, 45, 78, 150, 168, 99, 180, 220, 180, 210, 220, 200];

  const series = [
    ...(showIncome ? [{ data: incomeData, label: 'Income', color: theme.palette.warning.main, valueFormatter }] : []),
    ...(showCostOfSales ? [{ data: costData, label: 'Cost of Sales', color: theme.palette.primary.main, valueFormatter }] : [])
  ];

  return (
    <MainCard content={false} sx={{ mt: 1 }}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Net Profit
            </Typography>
            <Typography variant="h4">$1560</Typography>
          </Box>
          <FormGroup>
            <Stack direction="row" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showIncome}
                    onChange={handleIncomeChange}
                    sx={{
                      '&.Mui-checked': { color: theme.palette.warning.main },
                      '&:hover': { backgroundColor: alpha(theme.palette.warning.main, 0.08) }
                    }}
                  />
                }
                label="Income"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showCostOfSales}
                    onChange={handleCostOfSalesChange}
                    sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
                  />
                }
                label="Cost of Sales"
              />
            </Stack>
          </FormGroup>
        </Stack>

        <BarChart
          height={380}
          series={series.map(s => ({ ...s, type: 'bar' }))}
          xAxis={[{ data: labels, scaleType: 'band' }]}
          slotProps={{ bar: { rx: 5, ry: 5 } }}
          margin={{ top: 30, bottom: 25, left: 40, right: 20 }}
          sx={{
            '& .MuiBarElement-root:hover': { opacity: 0.6 }
          }}
        />
      </Box>
    </MainCard>
  );
}