import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import './App.css';
import axios from 'axios';

import Home from './components/Project';
import Error from './components/Error';

import { Alert, AppBar, Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Drawer, FormControl, Grid, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Tab, Tabs, TextField, Toolbar, Typography } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import Search from '@mui/icons-material/Search';
import Login from '@mui/icons-material/Login';
import CreateOutlined from '@mui/icons-material/CreateOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import Logout from '@mui/icons-material/Logout';
import { checkEmail, checkPassword, checkString, comparePasswords } from './validation';

const drawerWidth = 220;

function App() {
  const [user, setUser] = useState(null);

  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createProjectTitleError, setCreateProjectTitleError] = useState(null);

  const [joinProjectOpen, setJoinProjectOpen] = useState(false);
  const [joinProjectIdError, setJoinProjectIdError] = useState(null);

  const [logInOpen, setLogInOpen] = useState(false);
  const [logInEmail, setLogInEmail] = useState(null);
  const [logInPassword, setLogInPassword] = useState(null);
  const [logInError, setLogInError] = useState(null);

  const [signUpOpen, setSignUpOpen] = useState(false);
  const [signUpFirstName, setSignUpFirstName] = useState(null);
  const [signUpLastName, setSignUpLastName] = useState(null);
  const [signUpEmail, setSignUpEmail] = useState(null);
  const [signUpPassword, setSignUpPassword] = useState(null);
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState(null);
  const [signUpRole, setSignUpRole] = useState(null);
  const [signUpFirstNameError, setSignUpFirstNameError] = useState(null);
  const [signUpLastNameError, setSignUpLastNameError] = useState(null);
  const [signUpEmailError, setSignUpEmailError] = useState(null);
  const [signUpPasswordError, setSignUpPasswordError] = useState(null);
  const [signUpConfirmPasswordError, setSignUpConfirmPasswordError] = useState(null);
  const [signUpRoleError, setSignUpRoleError] = useState(null);

  const [logOutOpen, setLogOutOpen] = useState(false);
  
  useEffect(() => {
		async function fetchData() {
			try {
				const { data } = await axios.get(`http://localhost:4000/getUser`);
        setUser((Object.keys(data).length == 0) ? null : data);
			} catch (e) {
				setUser(null);
			}
		}
		fetchData();
	}, []);

  const handleCreateProjectOpen = () => {
    setCreateProjectOpen(true);
  }
  const handleCreateProjectClose = () => {
    setCreateProjectOpen(false);
    hideCreateProjectTitleError();
  }
  const handleCreateProjectSubmit = () => {
    
  }

  const handleJoinProjectOpen = () => {
    setJoinProjectOpen(true);
  }
  const handleJoinProjectClose = () => {
    setJoinProjectOpen(false);
    hideJoinProjectIdError();
  }
  const handleJoinProjectSubmit = () => {
    
  }

  const handleLogInOpen = () => {
    setLogInOpen(true);
  }
  const handleLogInClose = () => {
    setLogInOpen(false);
    resetLogInValues();
    resetLogInErrors();
  }
  const handleLogInSubmit = () => {
    let errors = 0;

    let email;
    try {
      email = checkEmail(logInEmail);
    } catch (e) {
      errors++;
      setLogInError('Either the email or password is invalid');
    }

    let password;
    try {
      password = checkPassword(logInPassword);
    } catch (e) {
      errors++;
      setLogInError('Either the email or password is invalid');
    }

    if (errors == 0) {
      async function fetchData() {
        try {
          const { data } = await axios.post(`http://localhost:4000/logIn?email=${email}&password=${password}`);
          hideLogInError();
          setUser(data);
          handleLogInClose();
        } catch (e) {
          setUser(null);
          setLogInError('Either the email or password is invalid');
        }
      }
      fetchData();
    }
  }

  const handleSignUpOpen = () => {
    setSignUpOpen(true);
  }
  const handleSignUpClose = () => {
    setSignUpOpen(false);
    resetSignUpValues();
    resetSignUpErrors();
  }
  const handleSignUpSubmit = () => {
    let errors = 0;

    let firstName;
    try {
      firstName = checkString(signUpFirstName);
      hideSignUpFirstNameError();
    } catch (e) {
      errors++;
      setSignUpFirstNameError(e);
    }
    let lastName;
    try {
      lastName = checkString(signUpLastName);
      hideSignUpLastNameError();
    } catch (e) {
      errors++;
      setSignUpLastNameError(e);
    }
    let email;
    try {
      email = checkEmail(signUpEmail);
      hideSignUpEmailError();
    } catch (e) {
      errors++;
      setSignUpEmailError(e);
    }
    let password;
    try {
      password = checkPassword(signUpPassword);
      hideSignUpPasswordError();
    } catch (e) {
      errors++;
      setSignUpPasswordError(e);
    }
    let confirmPassword;
    try {
      confirmPassword = comparePasswords(signUpPassword, signUpConfirmPassword);
      hideSignUpConfirmPasswordError();
    } catch (e) {
      errors++;
      setSignUpConfirmPasswordError(e);
    }
    let role;
    try {
      role = checkString(signUpRole);
      hideSignUpRoleError();
    } catch (e) {
      errors++;
      setSignUpRoleError(e);
    }

    if (errors == 0) {
      async function fetchData() {
        try {
          const { data } = await axios.post(`http://localhost:4000/signUp?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}&confirmPassword=${confirmPassword}&role=${role}`);
          setUser(data._id ? data : null);
          if (data._id) {
            setUser(data);
            handleSignUpClose();
          } else {
            setUser(null);
          }
        } catch (e) {
          setUser(null);
        }
      }
      fetchData();
    }
  }

  const handleLogOutOpen = () => {
    setLogOutOpen(true);
  }
  const handleLogOutClose = () => {
    setLogOutOpen(false);
  }
  const handleLogOutSubmit = () => {
    async function fetchData() {
        try {
          await axios.post(`http://localhost:4000/logOut`);
        } catch (e) {
          
        }
        setUser(null);
        handleLogOutClose();
      }
      fetchData();
  }

  const handleLogInEmailChange = (event) => {
    setLogInEmail(event.target.value);
  }
  const handleLogInPasswordChange = (event) => {
    setLogInPassword(event.target.value);
  }

  const handleSignUpFirstNameChange = (event) => {
    setSignUpFirstName(event.target.value);
  }
  const handleSignUpLastNameChange = (event) => {
    setSignUpLastName(event.target.value);
  }
  const handleSignUpEmailChange = (event) => {
    setSignUpEmail(event.target.value);
  }
  const handleSignUpPasswordChange = (event) => {
    setSignUpPassword(event.target.value);
  }
  const handleSignUpConfirmPasswordChange = (event) => {
    setSignUpConfirmPassword(event.target.value);
  }
  const handleSignUpRoleChange = (event) => {
    setSignUpRole(event.target.value);
  }

  const resetLogInValues = () => {
    setLogInEmail(null);
    setLogInPassword(null);
  }
  const resetLogInErrors = () => {
    hideLogInError();
  }
  const resetSignUpValues = () => {
    setSignUpFirstName(null);
    setSignUpLastName(null);
    setSignUpEmail(null);
    setSignUpPassword(null);
    setSignUpConfirmPassword(null);
    setSignUpRole(null);
  }
  const resetSignUpErrors = () => {
    hideSignUpFirstNameError();
    hideSignUpLastNameError();
    hideSignUpEmailError();
    hideSignUpPasswordError();
    hideSignUpConfirmPasswordError();
    hideSignUpRoleError(); 
  }

  const hideCreateProjectTitleError = () => {
    setCreateProjectTitleError(false);
  }
  const hideJoinProjectIdError = () => {
    setJoinProjectIdError(false);
  }
  const hideLogInError = () => {
    setLogInError(false);
  }
  const hideSignUpFirstNameError = () => {
    setSignUpFirstNameError(false);
  }
  const hideSignUpLastNameError = () => {
    setSignUpLastNameError(false);
  }
  const hideSignUpEmailError = () => {
    setSignUpEmailError(false);
  }
  const hideSignUpPasswordError = () => {
    setSignUpPasswordError(false);
  }
  const hideSignUpConfirmPasswordError = () => {
    setSignUpConfirmPasswordError(false);
  }
  const hideSignUpRoleError = () => {
    setSignUpRoleError(false);
  }

  const theme = useTheme();

  return (
    <Router>
      <div className='App'>
        <Dialog open={createProjectOpen} onClose={handleCreateProjectClose}>
          <DialogTitle>Create Project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a title for your project.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="Title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
            />
            {createProjectTitleError && <Alert severity="error" onClose={hideCreateProjectTitleError}>{createProjectTitleError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateProjectClose}>Cancel</Button>
            <Button onClick={handleCreateProjectClose}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={joinProjectOpen} onClose={handleJoinProjectClose}>
          <DialogTitle>Join Project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the ID of the project you want to join.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="ID"
              label="ID"
              type="text"
              fullWidth
              variant="standard"
            />
            {joinProjectIdError && <Alert severity="error" onClose={hideJoinProjectIdError}>{joinProjectIdError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleJoinProjectClose}>Cancel</Button>
            <Button onClick={handleJoinProjectClose}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={logInOpen} onClose={handleLogInClose}>
          <DialogTitle>Log In</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Email"
              label="Email"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleLogInEmailChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="Password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              onChange={handleLogInPasswordChange}
            />
            {logInError && <Alert severity="error" onClose={hideLogInError}>{logInError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogInClose}>Cancel</Button>
            <Button onClick={handleLogInSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={signUpOpen} onClose={handleSignUpClose}>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogContent>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="First Name"
                  label="First Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={handleSignUpFirstNameChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="Last Name"
                  label="Last Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={handleSignUpLastNameChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                {signUpFirstNameError && <Alert severity="error" onClose={hideSignUpFirstNameError}>{signUpFirstNameError}</Alert>}
              </Grid>
              <Grid item xs={6}>
                {signUpLastNameError && <Alert severity="error" onClose={hideSignUpLastNameError}>{signUpLastNameError}</Alert>}
              </Grid>
            </Grid>
            <TextField
              autoFocus
              margin="dense"
              id="Email"
              label="Email"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleSignUpEmailChange}
            />
            {signUpEmailError && <Alert severity="error" onClose={hideSignUpEmailError}>{signUpEmailError}</Alert>}
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  id="Password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  onChange={handleSignUpPasswordChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  id="Confirm Password"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  onChange={handleSignUpConfirmPasswordChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                {signUpPasswordError && <Alert severity="error" onClose={hideSignUpPasswordError}>{signUpPasswordError}</Alert>}
              </Grid>
              <Grid item xs={6}>
                {signUpConfirmPasswordError && <Alert severity="error" onClose={hideSignUpConfirmPasswordError}>{signUpConfirmPasswordError}</Alert>}
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mt: 2, mb: .5 }}>
              <InputLabel id="RoleLabel">Role</InputLabel>
              <Select
                margin="dense"
                labelId="RoleLabel"
                id="Role"
                value={signUpRole}
                label="Role"
                onChange={handleSignUpRoleChange}
              >
                <MenuItem value="Closeout Department">Closeout Department</MenuItem>
                <MenuItem value="Construction Manager">Construction Manager</MenuItem>
                <MenuItem value="Consumer">Consumer</MenuItem>
                <MenuItem value="Engineering/Permitting Team">Engineering/Permitting Team</MenuItem>
                <MenuItem value="Operations Manager">Operations Manager</MenuItem>
                <MenuItem value="Sales Representative">Sales Representative</MenuItem>
                <MenuItem value="Site Surveyor">Site Surveyor</MenuItem>
              </Select>
            </FormControl>
            {signUpRoleError && <Alert severity="error" onClose={hideSignUpRoleError}>{signUpRoleError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSignUpClose}>Cancel</Button>
            <Button onClick={handleSignUpSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={logOutOpen} onClose={handleLogOutClose}>
          <DialogTitle>Log Out</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to log out?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogOutClose}>Cancel</Button>
            <Button onClick={handleLogOutSubmit}>Confirm</Button>
          </DialogActions>
        </Dialog>

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
              {user ?
                <List>
                  <ListItem key='Create Project' disablePadding>
                    <ListItemButton onClick={handleCreateProjectOpen}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <AddCircleOutline color='primary' />
                      </ListItemIcon>
                      <ListItemText primary='Create Project' primaryTypographyProps={{ color: theme.palette.primary.main, fontWeight: 'bold' }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem key='Join Project' disablePadding>
                    <ListItemButton onClick={handleJoinProjectOpen}>
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

                  <Divider />

                  <ListItem key='Settings' disablePadding>
                    <ListItemButton>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <SettingsOutlined color='primary' />
                      </ListItemIcon>
                      <ListItemText primary='Settings' primaryTypographyProps={{ color: theme.palette.primary.main, fontWeight: 'bold' }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem key='Log Out' disablePadding>
                    <ListItemButton onClick={handleLogOutOpen}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Logout color='error' />
                      </ListItemIcon>
                      <ListItemText primary='Log Out' primaryTypographyProps={{ color: theme.palette.error.main, fontWeight: 'bold' }} />
                    </ListItemButton>
                  </ListItem>
                </List>
              :
                <List>
                  <ListItem key='Log In' disablePadding>
                    <ListItemButton onClick={handleLogInOpen}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Login color='primary' />
                      </ListItemIcon>
                      <ListItemText primary='Log In' primaryTypographyProps={{ color: theme.palette.primary.main, fontWeight: 'bold' }} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem key='Sign Up' disablePadding>
                    <ListItemButton onClick={handleSignUpOpen}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CreateOutlined color='primary' />
                      </ListItemIcon>
                      <ListItemText primary='Sign Up' primaryTypographyProps={{ color: theme.palette.primary.main, fontWeight: 'bold' }} />
                    </ListItemButton>
                  </ListItem>
                </List>
              }
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
