// src/components/Blocks/Graphics/ChartBar.jsx
import {
    BarChart,
    Card,
    List,
    ListItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from '@tremor/react';
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  const dataEurope = [
    { date: 'Jan 23', Successful: 12, Refunded: 0, 'Early fraud warning': 1 },
    { date: 'Feb 23', Successful: 24, Refunded: 1, 'Early fraud warning': 1 },
    { date: 'Mar 23', Successful: 48, Refunded: 4, 'Early fraud warning': 4 },
    { date: 'Apr 23', Successful: 24, Refunded: 2, 'Early fraud warning': 3 },
    { date: 'May 23', Successful: 34, Refunded: 0, 'Early fraud warning': 0 },
    { date: 'Jun 23', Successful: 26, Refunded: 0, 'Early fraud warning': 0 },
    { date: 'Jul 23', Successful: 12, Refunded: 0, 'Early fraud warning': 0 },
    { date: 'Aug 23', Successful: 38, Refunded: 2, 'Early fraud warning': 0 },
    { date: 'Sep 23', Successful: 23, Refunded: 1, 'Early fraud warning': 0 },
    { date: 'Oct 23', Successful: 20, Refunded: 0, 'Early fraud warning': 0 },
    { date: 'Nov 23', Successful: 24, Refunded: 0, 'Early fraud warning': 0 },
    { date: 'Dec 23', Successful: 21, Refunded: 8, 'Early fraud warning': 1 },
  ];
  
  const dataNorthAmerica = [
    { date: 'Jan 23', Successful: 65, Refunded: 2, 'Early fraud warning': 1 },
    { date: 'Feb 23', Successful: 78, Refunded: 3, 'Early fraud warning': 2 },
    { date: 'Mar 23', Successful: 55, Refunded: 5, 'Early fraud warning': 6 },
    { date: 'Apr 23', Successful: 79, Refunded: 4, 'Early fraud warning': 3 },
    { date: 'May 23', Successful: 41, Refunded: 1, 'Early fraud warning': 1 },
    { date: 'Jun 23', Successful: 32, Refunded: 1, 'Early fraud warning': 1 },
    { date: 'Jul 23', Successful: 54, Refunded: 0, 'Early fraud warning': 0 },
    { date: 'Aug 23', Successful: 45, Refunded: 3, 'Early fraud warning': 1 },
    { date: 'Sep 23', Successful: 75, Refunded: 2, 'Early fraud warning': 0 },
    { date: 'Oct 23', Successful: 62, Refunded: 1, 'Early fraud warning': 0 },
    { date: 'Nov 23', Successful: 55, Refunded: 1, 'Early fraud warning': 0 },
    { date: 'Dec 23', Successful: 58, Refunded: 6, 'Early fraud warning': 2 },
  ];
  
  const dataAsia = [
    { date: 'Jan 23', Successful: 31, Refunded: 1, 'Early fraud warning': 2 },
    { date: 'Feb 23', Successful: 32, Refunded: 2, 'Early fraud warning': 1 },
    { date: 'Mar 23', Successful: 44, Refunded: 3, 'Early fraud warning': 3 },
    { date: 'Apr 23', Successful: 23, Refunded: 2, 'Early fraud warning': 4 },
    { date: 'May 23', Successful: 35, Refunded: 1, 'Early fraud warning': 1 },
    { date: 'Jun 23', Successful: 48, Refunded: 1, 'Early fraud warning': 1 },
    { date: 'Jul 23', Successful: 33, Refunded: 1, 'Early fraud warning': 1 },
    { date: 'Aug 23', Successful: 38, Refunded: 3, 'Early fraud warning': 0 },
    { date: 'Sep 23', Successful: 41, Refunded: 2, 'Early fraud warning': 0 },
    { date: 'Oct 23', Successful: 39, Refunded: 1, 'Early fraud warning': 0 },
    { date: 'Nov 23', Successful: 32, Refunded: 1, 'Early fraud warning': 1 },
    { date: 'Dec 23', Successful: 19, Refunded: 5, 'Early fraud warning': 1 },
  ];
  
  const summary = [
    {
      name: 'Europe',
      data: dataEurope,
      details: [
        { name: 'Successful', value: 263 },
        { name: 'Refunded', value: 18 },
        { name: 'Fraud', value: 10 },
      ],
    },
    {
      name: 'North America',
      data: dataNorthAmerica,
      details: [
        { name: 'Successful', value: 652 },
        { name: 'Refunded', value: 29 },
        { name: 'Fraud', value: 17 },
      ],
    },
    {
      name: 'Asia',
      data: dataAsia,
      details: [
        { name: 'Successful', value: 405 },
        { name: 'Refunded', value: 21 },
        { name: 'Fraud', value: 15 },
      ],
    },
  ];
  
  const valueFormatter = (number) =>
    `${Intl.NumberFormat('us').format(number).toString()}`;
  
  // CORES MARROM CLARO (suave e elegante)
  const statusColor = {
    Successful: 'bg-amber-600',     // marrom claro quente
    Refunded: 'bg-amber-500',
    Fraud: 'bg-amber-400',
  };
  
  export default function ChartBar() {
    return (
      <Card className="h-full border border-gray-200 shadow-sm">
        <h3 className="text-sm font-medium text-gray-900">
          Online payments
        </h3>
  
        <TabGroup className="mt-3">
          <TabList className="flex space-x-1" variant="solid">
            {summary.map((tab) => (
              <Tab
                key={tab.name}
                className="text-xs font-medium px-3 py-1.5 rounded-md data-[selected]:bg-amber-100 data-[selected]:text-amber-900"
              >
                {tab.name}
              </Tab>
            ))}
          </TabList>
  
          <TabPanels>
            {summary.map((region) => (
              <TabPanel key={region.name} className="pt-4">
                <BarChart
                  data={region.data}
                  index="date"
                  categories={['Successful', 'Refunded', 'Early fraud warning']}
                  colors={['amber-600', 'amber-500', 'amber-400']} // marrom claro
                  valueFormatter={valueFormatter}
                  stack={true}
                  showLegend={false}
                  showYAxis={false}
                  showXAxis={true}
                  startEndOnly={true}
                  className="h-40"
                />
  
                <List className="mt-3 space-y-1">
                  {region.details.map((item) => (
                    <ListItem key={item.name} className="py-1.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={classNames(
                            statusColor[item.name],
                            'h-1 w-3 rounded-full'
                          )}
                          aria-hidden="true"
                        />
                        <span className="text-xs text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-900">
                        {valueFormatter(item.value)}
                      </span>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </Card>
    );
  }