'use client';

import { Box, Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { _mock } from '../../../data/_mock';

const CHART_DATA = _mock.dashboard.chart.report;

export default function ReportCard() {
  return (
    <Card>
      <CardContent sx={{ p: 3, pb: 0 }}>
        <Typography variant="h6">Analytics Report</Typography>
      </CardContent>
      <Box sx={{ p: 0 }}>
        <List disablePadding sx={{ p: 0 }}>
          <ListItem sx={{ py: 1.5 }}>
            <ListItemText primary="Company Finance Growth" />
            <Typography variant="subtitle1" sx={{ color: 'success.main' }}>
              +45.14%
            </Typography>
          </ListItem>
          <ListItem sx={{ py: 1.5 }}>
            <ListItemText primary="Company Expenses Ratio" />
            <Typography variant="subtitle1" sx={{ color: 'warning.main' }}>
              0.58%
            </Typography>
          </ListItem>
          <ListItem sx={{ py: 1.5 }}>
            <ListItemText primary="Business Risk Cases" />
            <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
              Low
            </Typography>
          </ListItem>
        </List>
        <Box sx={{ p: 3, pb: 0 }}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Card>
  );
}