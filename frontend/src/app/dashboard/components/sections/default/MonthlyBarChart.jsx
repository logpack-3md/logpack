'use client';

import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { CardContent, Typography } from '@mui/material';

export default function MonthlyBarChart() {
  const [series] = useState([
    {
      name: 'Income',
      data: [1800, 2100, 1900, 2200, 2500, 2700, 3000, 3200, 3400, 3600, 3800, 4000],
    },
  ]);

  const options = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    colors: ['#556cd6'],
    tooltip: { theme: 'light' },
  };

  return (
    <CardContent sx={{ p: 0 }}>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </CardContent>
  );
}