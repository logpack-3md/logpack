// app/dashboard/sections/default/AppConversionRates.js
'use client';

import { Card, CardHeader, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Italy', value: 400 },
  { name: 'Japan', value: 300 },
  { name: 'China', value: 200 },
  { name: 'Canada', value: 278 },
  { name: 'France', value: 189 },
  { name: 'Germany', value: 239 }
];

export default function AppConversionRates() {
  return (
    <Card>
      <CardHeader title="Conversion Rates" />
      <Box sx={{ p: 3, pb: 1 }}>
        <ResponsiveContainer width="100%" height={364}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#556cd6" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}