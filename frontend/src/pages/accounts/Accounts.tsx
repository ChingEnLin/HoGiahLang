import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Container, Grid, Typography, Paper, List, ListItem, ListItemText, Switch, FormControlLabel, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, TextField, Drawer, ListItemIcon, Avatar, AppBar, Toolbar, ListItemButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DrawerMenu from '../../components/DrawerMenu';
import {AddAccount, DeleteAccount, FetchAccountDetails, UpdateCash, UpdateInvestment, DeleteInvestment, FetchCategories, AddCategory, GetExchangeRates, SaveInvestmentStatistics} from "../../../wailsjs/go/main/App";

type InvestmentTrimmed = {
    category: string;
    amount: number;
    currency: string;
};
type Investment = {
  id: number;
  account_id: number;
  name: string;
  category: string;
  amount: number;
  currency: string;
};
type Account = {
  id: number;
  name: string;
  holder: string;
  cash: number;
  cash_currency: string;
  investments: Investment[];
};
 
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const currencies = [
    {
      value: 'EUR',
      label: '€',
    },
    {
      value: 'USD',
      label: '$',
    },
    {
      value: 'TWD',
      label: 'NT$',
    },
    {
      value: 'JPY',
      label: '¥',
    },
  ];
const defaultInvestment: Investment = {
    id: 0,
    account_id: 0,
    name: '',
    category: '',
    amount: 0,
    currency: 'EUR',
};
const defaultAccount: Account = {
    id: 0,
    name: '',
    holder: '',
    cash: 0,
    cash_currency: 'EUR',
    investments: [defaultInvestment],
    };

const getCurrencyLabel = (currencyValue: string): string | undefined => {
    const currency = currencies.find(c => c.value === currencyValue);
    return currency ? currency.label : undefined;
};

const BankingInvestmentPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([defaultAccount]);
    const [selectedAccountId, setSelectedAccountId] = useState(accounts && accounts.length > 0 ? accounts[0].id : 0);
    const [selectedInvestmentId, setSelectedInvestmentId] = useState<number | null>(null);
    const [showOverallData, setShowOverallData] = useState(true);
    const [openPortfolioCurrency, setOpenPortfolioCurrency] = React.useState(false);
    const [portfolioCurrency, setPortfolioCurrency] = React.useState<string>(defaultInvestment.currency);
    const [exchangeRate, setExchangeRate] = React.useState<Record<string, number>>({});
    const [openAddAccount, setOpenAddAccount] = useState(false);
    const [openEditAccount, setOpenEditAccount] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountHolder, setNewAccountHolder] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [editedCash, setEditedCash] = useState(0);
    const [editedCashCurrency, setEditedCashCurrency] = useState(defaultInvestment.currency);
    const [editedInvestments, setEditedInvestments] = useState<Investment[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    if (categories === null) {
      setCategories([]);
    }
    const [mouseX, setMouseX] = useState<number | null>(null);
    const [mouseY, setMouseY] = useState<number | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const user = 1;

    const fetchAccount = () => {
        FetchAccountDetails(user)
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

    const fetchCategories = () => {
        FetchCategories(user)
            .then(response => {
                setCategories(response);
            })
            .catch(error => {
                console.error("error getting backend", error);
            });
    };
    useEffect(() => {
        fetchCategories();
    }, [editedInvestments, openEditAccount]);

    const allCurrencies: string[] = currencies.map(currency => currency.value);
    const fetchExchangeRate = () => {
        GetExchangeRates(portfolioCurrency, allCurrencies)
            .then(response => {
                setExchangeRate(response);
            })
            .catch(error => {
                console.error("error getting backend", error);
            });
    }
    useEffect(() => {
        fetchExchangeRate();
    }, [portfolioCurrency]);

    const selectedAccount = accounts?.find(account => account.id === selectedAccountId);
    const totalWealth = Number((selectedAccount?.investments?.reduce((sum, investment) => sum + investment.amount / exchangeRate[investment.currency], 0) ?? 0).toFixed(2));

    const portfolioData = selectedAccount?.investments?.map((investment, index) => ({
        name: investment.name,
        value: Number((investment.amount/exchangeRate[investment.currency]).toFixed(2)),
        color: COLORS[index % COLORS.length],
    }));

    // Calculate overall data across all accounts categorized by 'category'
    const overallData = accounts?.reduce((acc, account) => {
        account.investments?.forEach(investment => {
            if (!acc[investment.category]) {
                acc[investment.category] = { name: investment.category, value: 0 };
            }
            acc[investment.category].value += Number((investment.amount/exchangeRate[investment.currency]).toFixed(2));
        });
        return acc;
    }, {} as Record<string, { name: string; value: number }>);
    // Append cash to overall data
    accounts?.forEach(account => {
        if (!overallData['Cash']) {
            overallData['Cash'] = { name: 'Cash', value: 0 };
        }
        overallData['Cash'].value += Number((account.cash/exchangeRate[account.cash_currency]).toFixed(2));
    });

    const overallPortfolioData = overallData ? Object.values(overallData).map((data, index) => ({
        ...data,
        color: COLORS[index % COLORS.length],
    })) : [];

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
            fetchCategories();
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
        UpdateCash(selectedAccountId, editedCash, editedCashCurrency);
        UpdateInvestment(editedInvestments);
        setOpenEditAccount(false);
    };

    // Function to handle the opening of the context menu for deleting an account
    const handleDeleteAccountMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Function to handle the closing of the context menu
    const handleDeleteAccountMenuClose = () => {
        setAnchorEl(null);
    }

    // Function to delete an account
    const handleDeleteAccount = (accountId: number) => {
        // Delete the account
        // Remove the account from the list of accounts
        // Set the selected account to null
        setAccounts(accounts.filter(account => account.id !== accountId));
        setSelectedAccountId(accounts[0]?.id ?? null);
        setAnchorEl(null);
        DeleteAccount(accountId);
    }

    const handlePortfolioCurrencyChange = (currency: string) => {
        setPortfolioCurrency(currency);
      };
    
    const handleOpenPortfolioCurrency = () => {
        setOpenPortfolioCurrency(true);
    };

    const handleClosePortfolioCurrency = () => {
        setOpenPortfolioCurrency(false);
    };

    // Function to save the record
    const handleSaveRecord = async () => {
        const exportedData: InvestmentTrimmed[] = dataToDisplay?.map(data => ({
            category: data.name,
            amount: data.value,
            currency: portfolioCurrency,
        })) ?? [];
        SaveInvestmentStatistics(exportedData)
            .then(() => {
                console.log('Investment statistics saved successfully.');
            })
            .catch(error => {
                console.error('Error saving investment statistics:', error);
            });
    };

    // Function to handle the opening of the context menu for deleting an investment
    const handleContextMenu = (event: React.MouseEvent, id: number) => {
        event.preventDefault();
        setMouseX(event.clientX - 2);  // Adjust slightly to position menu correctly
        setMouseY(event.clientY - 4);
        setSelectedInvestmentId(id);
    };

    // Function to handle the closing of the context menu
    const handleMenuClose = () => {
        setMouseX(null);
        setMouseY(null);
        setSelectedInvestmentId(null);
    };

    // Function to handle the click event for the context menu
    const handleDeleteInvestment = (investmentId: number) => {
        DeleteInvestment(investmentId);
        // Remove the deleted investment from the editedInvestments state
        setEditedInvestments(editedInvestments.filter(investment => investment.id !== investmentId));
        handleMenuClose();
    };

    // Function to add a new category to the list of categories
    const handleAddCategory = (newCategory: string) => {
        setCategories((prevCategories) => [...prevCategories, newCategory]);
        AddCategory(user, newCategory);
    };
    // Toggle Drawer open/close
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
        return;
        }
        setDrawerOpen(open);
    };

    const portfolioCurrencyDialog = () => {
        return (
            <div>
                <Button 
                    onClick={handleOpenPortfolioCurrency}>Select currency: {getCurrencyLabel(portfolioCurrency)}</Button>
                <Dialog open={openPortfolioCurrency} onClose={handleClosePortfolioCurrency}>
                    <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <TextField
                            id="portfolioCurrency-dialog-select"
                            label="Currency"
                            select
                            style={{ width: '100px' }}
                            value={portfolioCurrency}
                            onChange={(e) => handlePortfolioCurrencyChange(e.target.value)}
                        >
                            {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                        </TextField>
                    </Box>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    return (
        <Container style={{ backgroundColor: '#CFE8E5', margin: '0', padding: '0', textAlign: 'center' }}>
        <AppBar style={{ position: "relative", backgroundColor: "#3994B3" }} >
            <Toolbar>
            {/* Menu Button */}
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <DrawerMenu />
            </IconButton>
            <Typography variant="h6" component="div">
                HoGiahLang
            </Typography>
            </Toolbar>
        </AppBar>
        
        <Grid container spacing={2}>
            {/* Left Section */}
            <Grid item xs={5} >
            <Typography variant="h6" margin={'20px'}>Banking & Investment</Typography>

            {/* Accounts Section */}
            <Paper style={{ padding: '20px', margin: '20px', position: 'relative' }}>
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
                {accounts?.map(account => (
                    <ListItem
                        button
                        key={account.id}
                        selected={account.id === selectedAccountId}
                        onClick={() => setSelectedAccountId(account.id)}
                    >
                        <ListItemText
                            primary={`${account.name}`}
                            secondary={<>
                                <Typography component="span" variant="body2" color="textPrimary">
                                    {account.holder}
                                </Typography>
                                {` - ${Number((account.cash/exchangeRate[account.cash_currency] + (account.investments?.reduce((sum, investment) => sum + investment.amount/exchangeRate[account.cash_currency], 0) ?? 0)).toFixed(2))} ${getCurrencyLabel(account.cash_currency)}`}
                            </>} />
                            <IconButton
                                style={{ position: 'absolute', top: '8px', right: '36px' }}
                                onClick={(e) => handleDeleteAccountMenuClick(e)}
                            >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleDeleteAccountMenuClose}
                                >
                                    <MenuItem onClick={() => handleDeleteAccount(account.id)}>Delete account</MenuItem>
                                </Menu>
                    </ListItem>
                ))}
                </List>
            </Paper>

            {/* Investment Portfolio */}
            <Typography variant="h6" margin='20px'>Investment Portfolio</Typography>
            <Paper style={{ padding: '20px', position: 'relative', margin: '20px' }}>
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
                <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
                    {portfolioCurrencyDialog()}
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
                            <ListItemText primary={data.name} secondary={`${data.value} ${getCurrencyLabel(portfolioCurrency)}`} />
                        </ListItem>
                    ))}
                </List>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveRecord}
                    style={{ fontSize: '10px' }}
                    disabled={!showOverallData}
                >
                    Save Asset Record
                </Button>
            </Paper>
            </Grid>

            {/* Right Section */}

            <Grid item xs={7}>
            <Typography variant="h6" margin='20px'>Account Detail</Typography>
            <Paper style={{ padding: '20px', position: 'relative', margin: '20px'}}>
                {/* Edit Button */}
                <IconButton
                style={{ position: 'absolute', top: '0', right: '0' }}
                onClick={handleClickOpenEditAccount}
                title="Edit Account"
                disabled={!selectedAccount}
                >
                <EditIcon />
                </IconButton>
                <Typography variant="h5">{selectedAccount?.name ?? ''}</Typography>
                <Typography variant="subtitle1">{selectedAccount?.holder}</Typography>

                {/* Cash */}
                <Typography variant="h6" style={{ marginTop: '20px' }}>
                <AccountBalanceWalletIcon /> Cash
                </Typography>
                <Typography variant="body1">{`${selectedAccount?.cash_currency ?? defaultInvestment.currency} ${selectedAccount?.cash ?? 0} ${getCurrencyLabel(selectedAccount?.cash_currency ?? defaultInvestment.currency)}`}</Typography>

                {/* Wealth */}
                <Typography variant="h6" style={{ marginTop: '20px' }}>
                <AccountBalanceIcon /> Wealth
                </Typography>
                <Typography variant="body1" >{`${portfolioCurrency} ${totalWealth} ${getCurrencyLabel(portfolioCurrency)}`}</Typography>
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
                                    {` - ${`${investment.currency} ${investment.amount} ${getCurrencyLabel(investment.currency)}`}`}
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
            <DialogContentText>Cash</DialogContentText>
            <Paper
                key={selectedAccountId}
                style={{
                    padding: '16px',
                    marginBottom: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    width: '300px',
                }}
                elevation={3}
                >
                <Box sx={{ display: 'flow', flexWrap: 'wrap' }}>
                    <TextField
                        label="Amount"
                        type="number"
                        value={editedCash}
                        style={{ width: '75%', margin: "normal" }}
                        onChange={(e) => setEditedCash(Number(e.target.value))}
                    />
                    <TextField 
                        id="outlined-select-currency"
                        select
                        label="Currency"
                        value={editedCashCurrency}
                        style={{ width: '25%' }}
                        onChange={(e) => setEditedCashCurrency(e.target.value)}
                        >
                        {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Paper>
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
                    <Box sx={{ display: 'grid', flexWrap: 'wrap' }}>
                        <div>
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
                                style={{ width: '100%', marginBottom: '14px' }}
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
                                            if (categories && !categories.includes(value)) {
                                                const newInvestments = [...editedInvestments];
                                                newInvestments[index].category = value;
                                                setEditedInvestments(newInvestments);
                                                handleAddCategory(value);
                                            }
                                        }}
                                    />
                                )}
                                fullWidth
                            />
                            <TextField
                                label="Amount"
                                type="number"
                                style={{ width: '75%', margin: "normal"}}
                                value={investment.amount}
                                onChange={(e) => {
                                    const newInvestments = [...editedInvestments];
                                    newInvestments[index].amount = Number(e.target.value);
                                    setEditedInvestments(newInvestments);
                                }}
                            />
                            <TextField 
                                id="outlined-select-currency"
                                select
                                label="Currency"
                                value={investment.currency}
                                style={{ width: '25%' }}
                                onChange={(e) => {
                                    const newInvestments = [...editedInvestments];
                                    newInvestments[index].currency = e.target.value;
                                    setEditedInvestments(newInvestments);
                                }}
                                >
                                {currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </Box>
                </Paper>
            ))}
            <Button
                onClick={() => setEditedInvestments([...editedInvestments, { ...defaultInvestment, account_id: selectedAccountId }])}
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
