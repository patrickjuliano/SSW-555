import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import './App.css';

import Home from './components/Project';
import Error from './components/Error';

import { AppBar, Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import Search from '@mui/icons-material/Search';

const drawerWidth = 220;

function App() {
  const theme = useTheme();

  return (
    <Router>
      <div className='App'>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                Solar Project Management Tool
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                <ListItem key='Create Project' disablePadding>
                  <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <AddCircleOutline color='primary' />
                    </ListItemIcon>
                    <ListItemText primary='Create Project' primaryTypographyProps={{ color: theme.palette.primary.main, fontWeight: 'bold' }} />
                  </ListItemButton>
                </ListItem>
                <ListItem key='Join Project' disablePadding>
                  <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Search color='primary' />
                    </ListItemIcon>
                    <ListItemText primary='Join Project' primaryTypographyProps={{ color: theme.palette.primary.main, fontWeight: 'bold' }} />
                  </ListItemButton>
                </ListItem>
                
                <Divider />

                <ListItem key={'Project 1'} disablePadding>
                  <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 40 }} />
                    <ListItemText primary={'Project 1'} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={'Project 2'} disablePadding>
                  <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 40 }} />
                    <ListItemText primary={'Project 2'} />
                  </ListItemButton>
                </ListItem>
                <ListItem key={'Project 3'} disablePadding>
                  <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 40 }} />
                    <ListItemText primary={'Project 3'} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
          <Box component="main" sx={{ pt: 2, pb: 2, pl: 4, pr: 4 }}>
            <Toolbar />
            <div className='App-body'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/error' element={<Error />} />
                <Route path='*' element={<Navigate to={'/error'} replace />} />
              </Routes>
            </div>
          </Box>
        </Box>
      </div>
    </Router>
  );
}

export default App;
