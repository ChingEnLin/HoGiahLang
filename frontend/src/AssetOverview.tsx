import React, { useState } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const mockData = {
  "2024-08": {
    totalAsset: 50000,
    distribution: {
      stocks: 20000,
      etf: 15000,
      bonds: 10000,
      cash: 5000,
    },
  },
  "2024-07": {
    totalAsset: 48000,
    distribution: {
      stocks: 19000,
      etf: 14000,
      bonds: 9000,
      cash: 6000,
    },
  },
  // Add more mock data for other months as needed
};

const AssetOverview = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

const formattedMonth = format(currentMonth, 'yyyy-MM');
const dataForCurrentMonth = mockData[formattedMonth as keyof typeof mockData] || { totalAsset: 0, distribution: {} };

const pieData = {
    labels: Object.keys(dataForCurrentMonth.distribution),
    datasets: [
        {
            label: 'Asset Distribution',
            data: Object.values(dataForCurrentMonth.distribution),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
    ],
};

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Asset Overview</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={handlePrevMonth}>←</button>
        <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={handleNextMonth}>→</button>
      </div>
      <h4>Total Asset: ${dataForCurrentMonth.totalAsset.toLocaleString()}</h4>
      <div style={{ marginTop: '20px' }}>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default AssetOverview;
