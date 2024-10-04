import React from 'react';
import { Box, Typography, IconButton, Grid, Avatar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SavingsIcon from '@mui/icons-material/Savings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Link } from 'react-router-dom';

const HomePage = () => {
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
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100px"
                        bgcolor="#CFE8E5"
                        borderRadius="10px"
                        onClick={() => {
                            // Add your click event handler here
                        }}
                    >
                        <CalendarTodayIcon fontSize="large" />
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100px"
                        bgcolor="#CFE8E5"
                        borderRadius="10px"
                        onClick={() => {
                            // Add your click event handler here
                        }}
                    >
                        <SavingsIcon fontSize="large" />
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100px"
                        bgcolor="#CFE8E5"
                        borderRadius="10px"
                        onClick={() => {
                            // Add your click event handler here
                        }}
                    >
                        <NotificationsIcon fontSize="large" />
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100px"
                        bgcolor="#CFE8E5"
                        borderRadius="10px"
                        onClick={() => {
                            // Add your click event handler here
                        }}
                    ></Box>
                </Grid>
            </Grid>
            
            <Typography variant="subtitle1" gutterBottom>
                Generate comprehensive reports at your fingertips{' '}→
            </Typography>
            <Grid container spacing={3} mt={1}>
                <Grid item xs={3}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100px"
                        bgcolor="#CFE8E5"
                        borderRadius="10px"
                        onClick={() => {
                            // Add your click event handler here
                        }}
                    ></Box>
                </Grid>
                <Grid item xs={3}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100px"
                        bgcolor="#CFE8E5"
                        borderRadius="10px"
                        style={{ cursor: 'pointer' }}
                        component={Link}
                        to="/accounts"
                    >
                        <InsertChartIcon fontSize="large" />
                        <Typography ml={1}>Financial & Asset Reports</Typography>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100px"
                        bgcolor="#CFE8E5"
                        borderRadius="10px"
                        onClick={() => {
                            // Add your click event handler here
                        }}
                    >
                        <AttachMoneyIcon fontSize="large" />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </Box>
);
};

export default HomePage;
