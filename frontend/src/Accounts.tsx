import React, { useState } from 'react';
import { Container, Grid, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Mock data
const mockAccounts = [
  {
    id: 1,
    name: 'Bank/Account 1',
    holder: '<Holder name>',
    cash: 100000,
    investments: [
      { name: 'Schwab S&P 500 Fund', category: 'ETF Type 1', amount: 70000 },
      { name: 'Vanguard Total World Stock ETF', category: 'ETF Type 1', amount: 67000 },
      { name: 'Microsoft', category: 'Stock', amount: 3000 },
    ],
  },
  {
    id: 2,
    name: 'Bank/Account 2',
    holder: '<Holder name>',
    cash: 200000,
    investments: [
      { name: 'Apple', category: 'Stock', amount: 50000 },
      { name: 'Google', category: 'Stock', amount: 50000 },
      { name: 'Amazon', category: 'Stock', amount: 30000 },
    ],
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const BankingInvestmentPage = () => {
const [selectedAccountId, setSelectedAccountId] = useState(mockAccounts[0].id);

const selectedAccount = mockAccounts.find(account => account.id === selectedAccountId);
const totalWealth = selectedAccount?.investments.reduce((sum, investment) => sum + investment.amount, 0);

const portfolioData = selectedAccount?.investments.map((investment, index) => ({
    name: investment.name,
    value: investment.amount,
    color: COLORS[index % COLORS.length],
}));

  return (
    <Container style={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        {/* Left Section */}
        <Grid item xs={5}>
          <Typography variant="h6">Banking & Investment</Typography>

          {/* Accounts Section */}
          <Paper style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h5">Accounts</Typography>
            <List>
              {mockAccounts.map(account => (
                <ListItem
                  button
                  key={account.id}
                  selected={account.id === selectedAccountId}
                  onClick={() => setSelectedAccountId(account.id)}
                >
                <ListItemText
                    primary={`${account.name}`}
                    secondary={
                        <>
                            <Typography component="span" variant="body2" color="textPrimary">
                                {account.holder}
                            </Typography>
                            {` - ${account.cash + (totalWealth ?? 0)} $`}
                        </>
                    }
                />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Investment Portfolio */}
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Investment Portfolio</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                    data={portfolioData ?? []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                >
                    {(portfolioData ?? []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <List>
                {portfolioData?.map((data, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={data.name} secondary={`${data.value} $`} />
                    </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Section */}
        <Grid item xs={7}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h5">{selectedAccount?.name ?? ''}</Typography>
            <Typography variant="subtitle1">{selectedAccount?.holder}</Typography>

            {/* Cash */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              <AccountBalanceWalletIcon /> Cash
            </Typography>
            <Typography variant="body1">{`USD ${selectedAccount?.cash ?? 0} $`}</Typography>

            {/* Wealth */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              <AccountBalanceIcon /> Wealth
            </Typography>
            <Typography variant="body1">{`USD ${totalWealth} $`}</Typography>

            {/* Investments */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              Investment
            </Typography>
            {selectedAccount?.investments.map((investment, index) => (
                <Paper key={index} style={{ padding: '10px', marginBottom: '10px' }}>
                    <Typography variant="subtitle1">{investment.name}</Typography>
                    <Typography variant="body2">{investment.category}</Typography>
                    <Typography variant="body1">{`USD ${investment.amount} $`}</Typography>
                </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BankingInvestmentPage;
