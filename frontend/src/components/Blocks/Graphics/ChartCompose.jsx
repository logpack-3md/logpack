import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Utilitário para formatação de moeda
const valueFormatter = (value) => 
  `$${Intl.NumberFormat('us', { notation: "compact", compactDisplay: "short" }).format(value)}`;

const data = [
  { date: 'Aug 01', 'ETF Shares Vital': 2100.2, 'Vitainvest Core': 4434.1, 'iShares Tech Growth': 7943.2 },
  { date: 'Aug 02', 'ETF Shares Vital': 2943.0, 'Vitainvest Core': 4954.1, 'iShares Tech Growth': 8954.1 },
  { date: 'Aug 03', 'ETF Shares Vital': 4889.5, 'Vitainvest Core': 6100.2, 'iShares Tech Growth': 9123.7 },
  { date: 'Aug 04', 'ETF Shares Vital': 3909.8, 'Vitainvest Core': 4909.7, 'iShares Tech Growth': 7478.4 },
  { date: 'Aug 05', 'ETF Shares Vital': 5778.7, 'Vitainvest Core': 7103.1, 'iShares Tech Growth': 9504.3 },
  { date: 'Aug 06', 'ETF Shares Vital': 5900.9, 'Vitainvest Core': 7534.3, 'iShares Tech Growth': 9943.4 },
  { date: 'Aug 07', 'ETF Shares Vital': 4129.4, 'Vitainvest Core': 7412.1, 'iShares Tech Growth': 10112.2 },
  { date: 'Aug 08', 'ETF Shares Vital': 6021.2, 'Vitainvest Core': 7834.4, 'iShares Tech Growth': 10290.2 },
  { date: 'Aug 09', 'ETF Shares Vital': 6279.8, 'Vitainvest Core': 8159.1, 'iShares Tech Growth': 10349.6 },
  { date: 'Aug 10', 'ETF Shares Vital': 6224.5, 'Vitainvest Core': 8260.6, 'iShares Tech Growth': 10415.4 },
  { date: 'Aug 12', 'ETF Shares Vital': 6414.4, 'Vitainvest Core': 7989.3, 'iShares Tech Growth': 10900.5 },
  { date: 'Aug 15', 'ETF Shares Vital': 7124.6, 'Vitainvest Core': 6903.7, 'iShares Tech Growth': 11423.1 },
  { date: 'Aug 18', 'ETF Shares Vital': 10323.2, 'Vitainvest Core': 5732.1, 'iShares Tech Growth': 11011.7 },
  { date: 'Aug 22', 'ETF Shares Vital': 6900.8, 'Vitainvest Core': 4943.4, 'iShares Tech Growth': 10134.2 },
  { date: 'Aug 26', 'ETF Shares Vital': 9557.1, 'Vitainvest Core': 2158.3, 'iShares Tech Growth': 11059.1 },
  { date: 'Sep 02', 'ETF Shares Vital': 12593.8, 'Vitainvest Core': 5153.3, 'iShares Tech Growth': 14283.5 },
  { date: 'Sep 10', 'ETF Shares Vital': 13649.0, 'Vitainvest Core': 10139.2, 'iShares Tech Growth': 11143.8 },
  { date: 'Sep 15', 'ETF Shares Vital': 12012.8, 'Vitainvest Core': 11412.3, 'iShares Tech Growth': 7100.4 },
  { date: 'Sep 26', 'ETF Shares Vital': 17349.3, 'Vitainvest Core': 10943.4, 'iShares Tech Growth': 3935.1 },
];

const summary = [
  {
    name: 'ETF Shares Vital',
    value: '$21,349.36',
    invested: '$19,698.65',
    cashflow: '$14,033.74',
    gain: '+$11,012.39',
    realized: '+$177.48',
    dividends: '+$490.97',
    changeType: 'positive',
    chartColor: 'var(--color-chart-1)' 
  },
  {
    name: 'Vitainvest Core',
    value: '$25,943.43',
    invested: '$23,698.65',
    cashflow: '$11,033.74',
    gain: '+$3,012.39',
    realized: '+$565.41',
    dividends: '+$290.97',
    changeType: 'positive',
    chartColor: 'var(--color-chart-2)'
  },
  {
    name: 'iShares Tech Growth',
    value: '$9,443.46',
    invested: '$14,698.65',
    cashflow: '$2,033.74',
    gain: '-$5,012.39',
    realized: '-$634.42',
    dividends: '-$990.97',
    changeType: 'negative',
    chartColor: 'var(--color-chart-3)'
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="text-sm font-medium text-popover-foreground mb-2">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
             <div 
               className="w-2 h-2 rounded-full" 
               style={{ backgroundColor: entry.stroke }}
             />
             <span className="text-muted-foreground">{entry.name}:</span>
             <span className="font-semibold text-popover-foreground">
               {valueFormatter(entry.value)}
             </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerformanceDashboard() {
  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6 lg:p-8">
      
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Performance do Portfolio
        </h3>
        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
          <p className="text-3xl font-bold text-foreground">
            $32,227.40
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-500 ring-1 ring-inset ring-emerald-600/20">
              +$430.90 (4.1%)
            </span>
            <span className="text-sm text-muted-foreground">
              últimas 24 horas
            </span>
          </div>
        </div>
      </div>

      {/* GRAPHIC SECTION */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
            
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
            
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }} 
              iconType="circle"
              formatter={(value) => <span className="text-sm text-foreground ml-1">{value}</span>} 
            />
            
            <Line
              type="monotone"
              dataKey="ETF Shares Vital"
              stroke="var(--color-chart-1)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "var(--color-chart-1)", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="Vitainvest Core"
              stroke="var(--color-chart-2)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "var(--color-chart-2)", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="iShares Tech Growth"
              stroke="var(--color-chart-3)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "var(--color-chart-3)", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE SECTION */}
      <div className="mt-10 overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium">
              <tr>
                <th className="px-4 py-3 border-b border-border text-left">Nome</th>
                <th className="px-4 py-3 border-b border-border text-right whitespace-nowrap">Valor Total</th>
                <th className="px-4 py-3 border-b border-border text-right whitespace-nowrap">Investido</th>
                <th className="px-4 py-3 border-b border-border text-right whitespace-nowrap">Fluxo</th>
                <th className="px-4 py-3 border-b border-border text-right">Ganho</th>
                <th className="px-4 py-3 border-b border-border text-right">Realizado</th>
                <th className="px-4 py-3 border-b border-border text-right">Dividendos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {summary.map((item) => (
                <tr key={item.name} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3 whitespace-nowrap">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.chartColor }}
                        aria-hidden={true}
                      />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">{item.value}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{item.invested}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{item.cashflow}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={item.changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}>
                      {item.gain}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {item.realized}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-500">
                    {item.dividends}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}