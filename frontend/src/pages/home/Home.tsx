import React from 'react';
import { Box, Typography, IconButton, Grid, Avatar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SavingsIcon from '@mui/icons-material/Savings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const boxStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
        bgcolor: '#CFE8E5',
        borderRadius: '10px',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'black',
    };

    return (
        <Box display="flex" height="100vh">
            {/* Sidebar */}
            <Box width="80px" bgcolor="#E0E0E0" display="flex" flexDirection="column" alignItems="center" py={3}>
                <Avatar sx={{ bgcolor: '#333', mb: 5 }} />
                <IconButton sx={{ mt: 'auto', mb: 3 }}>
                    <SettingsIcon />
                </IconButton>
            </Box>

            {/* Main Content */}
            <Box flex={1} p={4}>
                {/* Title */}
                <Typography variant="h3" gutterBottom>
                    Home
                </Typography>

                {/* Subtitle */}
                <Typography variant="h5" gutterBottom>
                    Smart finance starts here—track, record, and achieve!
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Get started with managing your finances effortlessly{' '}→
                </Typography>

                {/* Icon Grid */}
                <Grid container spacing={3} mt={1} mb={3}>
                    <Grid item xs={3}>
                        <Box
                            sx={boxStyle}
                            onClick={() => {
                                // Add your click event handler here
                            }}
                        >
                            <CalendarMonthIcon fontSize="large" />
                            <Typography ml={1}>Monthly Household Profit & Loss Record</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box
                            sx={boxStyle}
                            onClick={() => {
                                // Add your click event handler here
                            }}
                        >
                            <SavingsIcon fontSize="large" />
                            <Typography ml={1}>Banking & Investments Management</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box
                            sx={boxStyle}
                            onClick={() => {
                                // Add your click event handler here
                            }}
                        >
                            <NotificationsIcon fontSize="large" />
                            <Typography ml={1}>Target Index Alert</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box
                            sx={boxStyle}
                            onClick={() => {
                                // Add your click event handler here
                            }}
                        >
                            <AddIcon fontSize="large" />
                            <Typography ml={1}>Get Ready for Something new</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Typography variant="subtitle1" gutterBottom>
                    Generate comprehensive reports at your fingertips{' '}→
                </Typography>
                <Grid container spacing={3} mt={1}>
                    <Grid item xs={3}>
                        <Box
                            sx={boxStyle}
                            onClick={() => {
                                // Add your click event handler here
                            }}
                        >
                            <ShowChartIcon fontSize="large" />
                            <Typography ml={1}>Household Profit & Loss Statement</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box
                            sx={{
                                ...boxStyle,
                                '&:hover': {
                                    bgcolor: '#B0D4D1',
                                },
                            }}
                            component={Link}
                            to="/accounts"
                        >
                            <DataSaverOffIcon fontSize="large" />
                            <Typography ml={1}>Financial & Asset Reports</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Box
                            sx={boxStyle}
                            onClick={() => {
                                // Add your click event handler here
                            }}
                        >
                            <AttachMoneyIcon fontSize="large" />
                            <Typography ml={1}>Cash Flow Statement</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage;
