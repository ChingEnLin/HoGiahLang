import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box, IconButton, ListItemButton, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface DrawerMenuProps {
  title?: string;
}

const DrawerMenu: React.FC<DrawerMenuProps> = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Toggle drawer open/close
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

return (
    <>
        {/* Menu Icon */}
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
        </IconButton>

        {/* Drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/">
                            <ListItemIcon>
                                <ListItemText primary={<b>Home</b>} />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/accounts">
                            <ListItemIcon>
                                <ListItemText primary={<b>Accounts</b>} />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    </>
);
};

export default DrawerMenu;
