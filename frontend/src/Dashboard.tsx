import React, { useState } from 'react';
import styled from 'styled-components';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

type CategoryData = {
  labels: string[];
  data: number[];
  backgroundColor: string[];
};
type CashflowData = {
  salary: number;
  spread: number;
  investment: number;
  spending: number;
};
type MonthlyCategoryData = Record<string, CategoryData>;
type MonthlyData = {
  categories: MonthlyCategoryData;
  cashflow: CashflowData;
};
type MonthlyDataType = Record<string, MonthlyData>;
// Mock data for the pie chart and cash flow for each month
const monthlyData: MonthlyDataType = {
  July: {
    categories: {
      Income: { labels: ['Salary', 'Investments', 'Others'], data: [5000, 2000, 1000], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] },
      Expense: { labels: ['Rent', 'Groceries', 'Entertainment'], data: [1500, 500, 300], backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384'] },
      Assets: { labels: ['Stocks', 'ETFs', 'Bonds', 'Cash'], data: [20000, 15000, 10000, 5000], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] },
      Liabilities: { labels: ['Mortgage', 'Credit Card', 'Loans'], data: [10000, 5000, 3000], backgroundColor: ['#FF9F40', '#FF6384', '#36A2EB'] },
    },
    cashflow: { salary: 5000, spread: 2000, investment: 3000, spending: 4000 },
  },
  August: {
    categories: {
      Income: { labels: ['Salary', 'Investments', 'Others'], data: [6000, 2500, 1500], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] },
      Expense: { labels: ['Rent', 'Groceries', 'Entertainment'], data: [1600, 600, 350], backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384'] },
      Assets: { labels: ['Stocks', 'ETFs', 'Bonds', 'Cash'], data: [21000, 16000, 11000, 6000], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] },
      Liabilities: { labels: ['Mortgage', 'Credit Card', 'Loans'], data: [10500, 5200, 3200], backgroundColor: ['#FF9F40', '#FF6384', '#36A2EB'] },
    },
    cashflow: { salary: 6000, spread: 2500, investment: 3500, spending: 4500 },
  },
};

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [selectedCategory, setSelectedCategory] = useState('Assets');
  const [showArrows, setShowArrows] = useState(true);

  const toggleArrows = () => {
    setShowArrows(!showArrows);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const months = Object.keys(monthlyData);
    const currentIndex = months.indexOf(selectedMonth);
    const newIndex = direction === 'prev' ? (currentIndex - 1 + months.length) % months.length : (currentIndex + 1) % months.length;
    setSelectedMonth(months[newIndex]);
  };

  const pieData = {
    labels: monthlyData[selectedMonth].categories[selectedCategory].labels,
    datasets: [
      {
        data: monthlyData[selectedMonth].categories[selectedCategory].data,
        backgroundColor: monthlyData[selectedMonth].categories[selectedCategory].backgroundColor,
      },
    ],
  };
  
  const { salary, spread, investment, spending } = monthlyData[selectedMonth].cashflow;
  const total = salary + spread + investment + spending;
  const salaryRatio = (salary / total) * 100;
  const spreadRatio = (spread / total) * 100;
  const investmentRatio = (investment / total) * 100;
  const spendingRatio = (spending / total) * 100;
  const salaryArrowPath = `M 500,125 Q 550,125 600,150`; // Salary Arrow: Outside to Income
  const spreadArrowPath = `M 725,700 Q 775,425 725,150`; // Spread Arrow: Asset to Income
  const investmentArrowPath = `M 625,150 Q 575,425 625,675`; // Investment Arrow: Income to Asset
  const spendingArrowPath = `M 900,700 Q 950,725 950,725`; // Expense Arrow: Expense to Outside

  return (
    <Container>
      <OverviewSection>
        <MonthNavigator>
          <button onClick={() => handleMonthChange('prev')}>←</button>
            <span style={{ color: 'black' }}>{selectedMonth}</span>
          <button onClick={() => handleMonthChange('next')}>→</button>
        </MonthNavigator>
        <h2>Overview</h2>
        <Pie data={pieData} />
      </OverviewSection>
      <CashflowSection>
        <Square onClick={() => setSelectedCategory('Income')} style={{ gridArea: 'income' }}>Income</Square>
        <Square onClick={() => setSelectedCategory('Expense')} style={{ gridArea: 'expense' }}>Expense</Square>
        <Square onClick={() => setSelectedCategory('Assets')} style={{ gridArea: 'assets' }}>Assets</Square>
        <Square onClick={() => setSelectedCategory('Liabilities')} style={{ gridArea: 'liabilities' }}>Liabilities</Square>
        {/* Toggle Button */}
        <ToggleButton onClick={toggleArrows} title="Show cash flow">
          {showArrows ? 'Hide Cash Flow' : 'Show Cash Flow'}
        </ToggleButton>
        {/* Arrows */}
        {showArrows && (
          <ArrowSvg width="100%" height="100%">
            <defs>
              <ArrowHeadMarker id="arrowhead" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" />
              </ArrowHeadMarker>
            </defs>
            <ArrowPath d={salaryArrowPath} strokeWidth={salaryRatio / 3} stroke="green" markerEnd="url(#arrowhead)" />
            <ArrowPath d={spreadArrowPath} strokeWidth={spreadRatio / 3} stroke="blue" markerEnd="url(#arrowhead)" />
            <ArrowPath d={investmentArrowPath} strokeWidth={investmentRatio / 3} stroke="purple" markerEnd="url(#arrowhead)" />
            <ArrowPath d={spendingArrowPath} strokeWidth={spendingRatio / 3} stroke="red" markerEnd="url(#arrowhead)" />
          </ArrowSvg>
        )}
      </CashflowSection>
    </Container>
  );
};


export default Dashboard;

// Styled Components
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

const OverviewSection = styled.div`
  flex: 1;
  margin-right: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    color: #4a4a4a; /* Dark grey color */
  }
`;

const CashflowSection = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  grid-template-areas:
    'income income'
    'expense expense'
    'assets liabilities';
`;

const Square = styled.div`
  background-color: #007bff;
  color: white;
  font-size: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  button {
    background-color: transparent;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
  }

  span {
    margin: 0 10px;
    font-size: 1.5em;
  }
`;

// SVG and Arrow Paths
const ArrowSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Prevent the SVG from interfering with the click events on squares */
`;

const ArrowPath = styled.path`
  fill: none;
  stroke-linecap: round;
  marker-end: url(#arrowhead); /* Add arrowheads if needed */
`;

const ArrowHeadMarker = styled.marker`
  fill: currentColor;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;