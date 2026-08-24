import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

import { useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';


const DRAWER_WIDTH = 260;

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'Người dùng',
    path: '/admin/users',
    icon: <PeopleIcon />,
  },
  {
    label: 'Khoa',
    path: '/admin/departments',
    icon: <LocalHospitalIcon />,
  },
  {
    label: 'Bác sĩ',
    path: '/admin/doctors',
    icon: <MedicalServicesIcon />,
  },
  {
    label: 'Lịch làm việc',
    path: '/admin/schedules',
    icon: <CalendarMonthIcon />,
  },
  {
    label: 'Lịch khám',
    path: '/admin/appointments',
    icon: <EventNoteIcon />,
  },
];

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const handleNavigate = (path: string) => {
    navigate(path);

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar>
        <Typography
          sx={{ fontWeight: 700, color: 'primary.main' }}
          variant="h6"
        >
          HIS Admin
        </Typography>
      </Toolbar>

      <Divider />

      <List sx={{ px: 1, pt: 2 }}>
        {menuItems.map(item => {
          const selected =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);

          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mb: 0.5,
                borderRadius: 2,
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <List sx={{ p: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'error.main',
          }}
        >
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>

          <ListItemText primary="Đăng xuất" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          ml: {
            md: `${DRAWER_WIDTH}px`,
          },
          width: {
            md: `calc(100% - ${DRAWER_WIDTH}px)`,
          },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            noWrap
            component="div"
          >
            Hospital Information System
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: {
            md: DRAWER_WIDTH,
          },
          flexShrink: {
            md: 0,
          },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {
              xs: 'block',
              md: 'none',
            },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'grey.50',
          width: {
            md: `calc(100% - ${DRAWER_WIDTH}px)`,
          },
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}