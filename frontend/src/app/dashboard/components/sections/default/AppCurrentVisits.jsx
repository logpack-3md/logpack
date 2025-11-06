// app/dashboard/sections/default/AppCurrentVisits.jsx
'use client';

import { Card, CardHeader, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }, { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 }, { name: 'May', value: 500 }, { name: 'Jun', value: 700 },
  { name: 'Jul', value: 900 }, { name: 'Aug', value: 750 }, { name: 'Sep', value: 850 },
  { name: 'Oct', value: 950 }, { name: 'Nov', value: 700 }, { name: 'Dec', value: 800 }
];

export default function AppCurrentVisits() {
  return (
    <Card>
      <CardHeader title="Current Visits" />
      <Box sx={{ p: 3, pb: 1 }}>
        <ResponsiveContainer width="100%" height={364}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#556cd6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}