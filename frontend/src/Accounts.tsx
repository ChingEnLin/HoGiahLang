import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, Container, Grid, Typography, Paper, List, ListItem, ListItemText, Switch, FormControlLabel, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {AddAccount, FetchAccountDetails, UpdateCash, UpdateInvestment, DeleteInvestment} from "../wailsjs/go/main/App";

type Investment = {
  id: number;
  account_id: number;
  name: string;
  category: string;
  amount: number;
};
type Account = {
  id: number;
  name: string;
  holder: string;
  cash: number;
  investments: Investment[];
};
 
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const BankingInvestmentPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState(0);
    const [selectedInvestmentId, setSelectedInvestmentId] = useState<number | null>(null);
    const [showOverallData, setShowOverallData] = useState(false);
    const [openAddAccount, setOpenAddAccount] = useState(false);
    const [openEditAccount, setOpenEditAccount] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountHolder, setNewAccountHolder] = useState('');
    const [editedCash, setEditedCash] = useState(0);
    const [editedInvestments, setEditedInvestments] = useState<Investment[]>([]);
    const [categories, setCategories] = useState<string[]>(['Stocks', 'ETFs', 'Bonds', 'Real Estate', 'Commodities']);
    const [mouseX, setMouseX] = useState<number | null>(null);
    const [mouseY, setMouseY] = useState<number | null>(null);

    const fetchAccount = () => {
        FetchAccountDetails(1)
            .then(response => {
                setAccounts(response);
            })
            .catch(error => {
                console.error("error getting backend", error);
            });
    };
    useEffect(() => {
        fetchAccount();
    }, [openAddAccount, openEditAccount]);
    const selectedAccount = accounts.find(account => account.id === selectedAccountId);
    const totalWealth = selectedAccount?.investments?.reduce((sum, investment) => sum + investment.amount, 0) ?? 0;

    const portfolioData = selectedAccount?.investments?.map((investment, index) => ({
        name: investment.name,
        value: investment.amount,
        color: COLORS[index % COLORS.length],
    }));

    // Calculate overall data across all accounts categorized by 'category'
    const overallData = accounts.reduce((acc, account) => {
        account.investments?.forEach(investment => {
            if (!acc[investment.category]) {
                acc[investment.category] = { name: investment.category, value: 0 };
            }
            acc[investment.category].value += investment.amount;
        });
        return acc;
    }, {} as Record<string, { name: string; value: number }>);

    const overallPortfolioData = Object.values(overallData).map((data, index) => ({
        ...data,
        color: COLORS[index % COLORS.length],
    }));

    const dataToDisplay = showOverallData ? overallPortfolioData : portfolioData;
    const totalValue = dataToDisplay?.reduce((sum, entry) => sum + entry.value, 0) ?? 0;

    // Custom tooltip formatter to display value and percentage
    const tooltipFormatter = (value: number) => {
        const percentage = ((value / totalValue) * 100).toFixed(2);
        return `${value} $ (${percentage}%)`;
    };

    // Function to handle the addition of a new account
    const handleAddAccount = () => {
        AddAccount(1, newAccountName, newAccountHolder);
        setOpenAddAccount(false);
    };

    // Function to open the popup dialog for adding a new account
    const handleClickOpenAddAccount = () => {
        setOpenAddAccount(true);
    };

    // Function to close the add account dialog
    const handleCloseAddAccount = () => {
        setOpenAddAccount(false);
    };

    // Function to open the edit account dialog
    const handleClickOpenEditAccount = () => {
        if (selectedAccount) {
            setEditedCash(selectedAccount.cash);
            setEditedInvestments([...selectedAccount.investments ?? []]);
            setOpenEditAccount(true);
        }
    };

    // Function to close the edit account dialog
    const handleCloseEditAccount = () => {
        setOpenEditAccount(false);
        setSelectedInvestmentId(null);
        setMouseX(null);
        setMouseY(null);
    };

    // Function to handle saving the edited account details
    const handleSaveAccount = () => {
        UpdateCash(selectedAccountId, editedCash);
        console.log('Edited Investments:', editedInvestments);
        UpdateInvestment(editedInvestments);
        setOpenEditAccount(false);
    };

    const handleContextMenu = (event: React.MouseEvent, id: number) => {
        event.preventDefault();
        setMouseX(event.clientX - 2);  // Adjust slightly to position menu correctly
        setMouseY(event.clientY - 4);
        setSelectedInvestmentId(id);
    };

    const handleMenuClose = () => {
        setMouseX(null);
        setMouseY(null);
        setSelectedInvestmentId(null);
    };

    const handleDeleteInvestment = (investmentId: number) => {
        DeleteInvestment(investmentId);
        // Remove the deleted investment from the editedInvestments state
        setEditedInvestments(editedInvestments.filter(investment => investment.id !== investmentId));
        handleMenuClose();
    };

    const handleAddCategory = (newCategory: string) => {
        setCategories((prevCategories) => [...prevCategories, newCategory]);
    };

    return (
        <Container style={{ marginTop: '20px' }}>
        <Grid container spacing={2}>
            {/* Left Section */}
            <Grid item xs={5}>
            <Typography variant="h6">Banking & Investment</Typography>

            {/* Accounts Section */}
            <Paper style={{ padding: '20px', marginBottom: '20px', position: 'relative' }}>
                <Typography variant="h5">Accounts</Typography>
                {/* Edit Button */}
                <IconButton
                style={{ position: 'absolute', top: '0', right: '0' }}
                onClick={handleClickOpenAddAccount}
                title="Edit Accounts"
                >
                <EditIcon />
                </IconButton>
                <List>
                {accounts.map(account => (
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
                                {` - ${account.cash + (account.investments?.reduce((sum, investment) => sum + investment.amount, 0) ?? 0)} $`}
                            </>
                        }
                    />
                    </ListItem>
                ))}
                </List>
            </Paper>

            {/* Investment Portfolio */}
            <Typography variant="h6">Investment Portfolio</Typography>
            <Paper style={{ padding: '20px', position: 'relative' }}>
                {/* Toggle Switch */}
                <div style={{ position: 'absolute', top: '0px', right: '0px' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showOverallData}
                                onChange={() => setShowOverallData(!showOverallData)}
                                color="primary"
                            />
                        }
                        label="Overall View"
                        title="Toggle between current account and overall view"
                    />
                </div>
                <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={dataToDisplay ?? []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                    >
                        {(dataToDisplay ?? []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={tooltipFormatter}/>
                </PieChart>
                </ResponsiveContainer>
                <List>
                    {dataToDisplay?.map((data, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={data.name} secondary={`${data.value} $`} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            </Grid>

            {/* Right Section */}

            <Grid item xs={7}>
            <Typography variant="h6">Account Detail</Typography>
            <Paper style={{ padding: '20px', position: 'relative'}}>
                {/* Edit Button */}
                <IconButton
                style={{ position: 'absolute', top: '0', right: '0' }}
                onClick={handleClickOpenEditAccount}
                title="Edit Account"
                >
                <EditIcon />
                </IconButton>
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
                {selectedAccount?.investments?.map((investment, index) => (
                    <Paper key={index} style={{ padding: '10px', marginBottom: '10px' }}>
                        <ListItemText
                            primary={`${investment.name}`}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        {investment.category}
                                    </Typography>
                                    {` - ${`USD ${investment.amount} $`}`}
                                </>
                            }
                        />
                    </Paper>
                ))}
            </Paper>
            </Grid>
        </Grid>

        {/* Dialog for Adding New Account */}
        <Dialog open={openAddAccount} onClose={handleCloseAddAccount}>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Account Name"
                fullWidth
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
            />
            <TextField
                margin="dense"
                label="Account Holder"
                fullWidth
                value={newAccountHolder}
                onChange={(e) => setNewAccountHolder(e.target.value)}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseAddAccount} color="primary">
                Cancel
            </Button>
            <Button onClick={handleAddAccount} color="primary">
                Add Account
            </Button>
            </DialogActions>
        </Dialog>

        {/* Dialog for Editing Account */}
        <Dialog open={openEditAccount} onClose={handleCloseEditAccount}>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogContent>
            <TextField
                margin="dense"
                label="Cash"
                type="number"
                fullWidth
                value={editedCash}
                onChange={(e) => setEditedCash(Number(e.target.value))}
            />
            <DialogContentText>Investments</DialogContentText>
            {editedInvestments.map((investment, index) => (
                <Paper
                    key={index}
                    style={{
                        padding: '16px',
                        marginBottom: '16px',
                        backgroundColor: '#f5f5f5', // Slightly darker background
                        borderRadius: '8px', // Rounded corners
                        width: '300px', // Fixed width for consistency
                    }}
                    elevation={3}
                    onContextMenu={(e) => handleContextMenu(e, investment.id)}
                >
                    <TextField
                        margin="dense"
                        label="Investment Name"
                        fullWidth
                        value={investment.name}
                        onChange={(e) => {
                        const newInvestments = [...editedInvestments];
                        newInvestments[index].name = e.target.value;
                        setEditedInvestments(newInvestments);
                        }}
                    />
                    <Autocomplete
                        freeSolo
                        value={investment.category}
                        onChange={(e, newValue) => {
                            const newInvestments = [...editedInvestments];
                            if (typeof newValue === 'string') {
                                newInvestments[index].category = newValue;
                                setEditedInvestments(newInvestments);
                            }
                        }}
                        options={categories}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Category"
                                margin="normal"
                                fullWidth
                                onBlur={(e) => {
                                    const value = e.target.value;
                                    if (!categories.includes(value)) {
                                        handleAddCategory(value);
                                    }
                                }}
                            />
                        )}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Amount"
                        type="number"
                        fullWidth
                        value={investment.amount}
                        onChange={(e) => {
                        const newInvestments = [...editedInvestments];
                        newInvestments[index].amount = Number(e.target.value);
                        setEditedInvestments(newInvestments);
                        }}
                    />
                </Paper>
            ))}
            <Button
                onClick={() => setEditedInvestments([...editedInvestments, { id: 0, account_id: selectedAccountId, name: '', category: '', amount: 0 }])}
                color="primary"
            >
                Add Investment
            </Button>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseEditAccount} color="primary">
                Cancel
            </Button>
            <Button onClick={handleSaveAccount} color="primary">
                Save
            </Button>
            </DialogActions>
        </Dialog>

        {/* Custom Context Menu */}
        <Menu
            open={mouseY !== null}
            onClose={handleMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={
                mouseY !== null && mouseX !== null
                    ? { top: mouseY, left: mouseX }
                    : undefined
            }
        >
            <MenuItem onClick={() => handleDeleteInvestment(selectedInvestmentId!)}>
                Delete Investment
            </MenuItem>
        </Menu>
        </Container>
    );
    };

export default BankingInvestmentPage;
