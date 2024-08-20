import React, { useState } from 'react';
import styled from 'styled-components';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

// Mock data for the pie chart
const mockData = {
  Income: {
    labels: ['Salary', 'Investments', 'Others'],
    data: [5000, 2000, 1000],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
  },
  Spending: {
    labels: ['Rent', 'Groceries', 'Entertainment'],
    data: [1500, 500, 300],
    backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6384'],
  },
  Assets: {
    labels: ['Stocks', 'ETFs', 'Bonds', 'Cash'],
    data: [20000, 15000, 10000, 5000],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  },
  Liabilities: {
    labels: ['Mortgage', 'Credit Card', 'Loans'],
    data: [10000, 5000, 3000],
    backgroundColor: ['#FF9F40', '#FF6384', '#36A2EB'],
  },
};

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('Assets');

  const pieData = {
    labels: mockData[selectedCategory as keyof typeof mockData].labels,
    datasets: [
      {
        data: mockData[selectedCategory as keyof typeof mockData].data,
        backgroundColor: mockData[selectedCategory as keyof typeof mockData].backgroundColor,
        hoverBackgroundColor: mockData[selectedCategory as keyof typeof mockData].backgroundColor,
      },
    ],
  };

  return (
    <Container>
      <OverviewSection>
        <h2>Overview</h2>
        <Pie data={pieData} />
      </OverviewSection>
      <CashflowSection>
        <Square onClick={() => setSelectedCategory('Income')} style={{ gridArea: 'income' }}>Income</Square>
        <Square onClick={() => setSelectedCategory('Spending')} style={{ gridArea: 'spending' }}>Spending</Square>
        <Square onClick={() => setSelectedCategory('Assets')} style={{ gridArea: 'assets' }}>Assets</Square>
        <Square onClick={() => setSelectedCategory('Liabilities')} style={{ gridArea: 'liabilities' }}>Liabilities</Square>
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
    'spending spending'
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