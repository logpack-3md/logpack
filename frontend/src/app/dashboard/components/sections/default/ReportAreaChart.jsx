'use client';

import ReactApexChart from 'react-apexcharts';

export default function ReportAreaChart() {
  const series = [{ name: 'Growth', data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10] }];
  const options = {
    chart: { type: 'area', toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    colors: ['#19857b'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9 } },
  };

  return <ReactApexChart options={options} series={series} type="area" height={150} />;
}