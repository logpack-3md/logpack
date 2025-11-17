'use client';

import { LineChart as MLineChart, LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { PieChart as MPieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, Typography } from '@mui/material';

const lineData = [
  { x: 'Mon', y: 2 },
  { x: 'Tue', y: 5.5 },
  { x: 'Wed', y: 2 },
  { x: 'Thu', y: 8.5 },
  { x: 'Fri', y: 1.5 },
  { x: 'Sat', y: 5 },
];

const pieData = [
  { id: 0, value: 37, label: 'Organic' },
  { id: 1, value: 25, label: 'Paid' },
  { id: 2, value: 38, label: 'Social' },
];

export function LineChart({ title }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <MLineChart
          xAxis={[{ data: lineData.map(d => d.x), scaleType: 'point' }]}
          series={[
            { data: lineData.map(d => d.y), label: 'Traffic', color: '#556cd6' },
            { data: lineData.map(d => d.y * 0.8), label: 'Conversions', color: '#19857b' },
          ]}
          height={300}
          sx={{ '& .MuiChartsAxis-line': { stroke: '#e5e5e5' } }}
        >
          <LinePlot />
          <MarkPlot />
        </MLineChart>
      </CardContent>
    </Card>
  );
}

export function PieChart({ title }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <MPieChart
          series={[
            {
              data: pieData,
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
            },
          ]}
          height={300}
          margin={{ right: 80 }}
          sx={{ '& .MuiChartsLegend-root': { position: 'absolute', right: 0 } }}
        />
      </CardContent>
    </Card>
  );
}