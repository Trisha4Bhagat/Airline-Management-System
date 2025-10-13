import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Flight as FlightIcon,
  Dashboard as DashboardIcon,
  BookOnline as BookingIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

interface DashboardLayoutProps {
  window?: () => Window;
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Flights', icon: <FlightIcon />, path: '/flights' },
    { text: 'My Bookings', icon: <BookingIcon />, path: '/bookings' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        color: 'white'
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FlightIcon /> SkyWay Airlines
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ 
        '& .MuiListItemIcon-root': { 
          color: '#3949ab',
          minWidth: '40px'
        },
        '& .MuiListItemButton-root:hover': {
          backgroundColor: 'rgba(63, 81, 181, 0.08)'
        },
        '& .MuiListItemButton-root.active': {
          backgroundColor: 'rgba(63, 81, 181, 0.16)',
          borderLeft: '4px solid #3949ab',
          '& .MuiListItemIcon-root': { 
            color: '#1a237e'
          }
        }
      }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
                  className={location.pathname === item.path ? 'active' : ''}            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: '#f44336' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window()?.document?.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(90deg, #008cff 0%, #3949ab 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Airline Reservation System
          </Typography>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>U</Avatar>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f8ff',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        {props.children || <Outlet />}
      </Box>
    </Box>
  );
};

export default DashboardLayout;