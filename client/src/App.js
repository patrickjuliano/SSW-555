import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, json } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import './App.css';
import axios from 'axios';

import Home from './components/Home';
import Project from './components/Project';
import Error from './components/Error';

import { Alert, AppBar, Box, Button, Checkbox, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Drawer, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Tab, Tabs, TextField, Toolbar, Typography } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import Search from '@mui/icons-material/Search';
import Login from '@mui/icons-material/Login';
import CreateOutlined from '@mui/icons-material/CreateOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import Logout from '@mui/icons-material/Logout';
import { checkBoolean, checkEmail, checkPassword, checkString, comparePasswords } from './validation';

const drawerWidth = 220;

function App() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [user, setUser] = useState(undefined);
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState(null);
  const [fetchFlag, setFetchFlag] = useState(true);
  const [loading, setLoading] = useState(true);
  const loadedUser = useRef(false);

  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createProjectTitle, setCreateProjectTitle] = useState(null);
  const [createProjectTitleError, setCreateProjectTitleError] = useState(null);
  const [createProjectAsSubproject, setCreateProjectAsSubproject] = useState(null);
  const [createProjectAddMembers, setCreateProjectAddMembers] = useState(null);

  const [joinProjectOpen, setJoinProjectOpen] = useState(false);
  const [joinProjectId, setJoinProjectId] = useState(null);
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
      if (fetchFlag) {
        try {
          const { data } = await axios.get(`http://localhost:4000/users/current`);
          if (Object.keys(data).length == 0) throw 'User is not logged in';
          setUser(data);
        } catch (e) {
          setUser(null);
        }
        // setLoading({ user: false, projects: true })
        loadedUser.current = true;
      }
		}
    fetchData();
	}, [fetchFlag]);

  useEffect(() => {
		async function fetchData() {
      if (!loadedUser.current) return;
      try {
        if (!user) throw 'No user found';
        const { data } = await axios.get(`http://localhost:4000/projects/users/${user._id}`);
        if (Object.keys(data).length == 0) throw 'No projects found';
        setProjects(data.projects);
      } catch (e) {
        setProjects(null);
      }
      setFetchFlag(false);
      setLoading(false);
		}
    fetchData();
	}, [user]);

  const handleCreateProjectOpen = () => {
    resetCreateProjectValues();
    resetCreateProjectErrors();
    setCreateProjectOpen(true);
  }
  const handleCreateProjectClose = () => {
    setCreateProjectOpen(false);
  }
  const handleCreateProjectSubmit = () => {
    let errors = 0;

    let title;
    try {
      title = checkString(createProjectTitle);
    } catch (e) {
      errors++;
      setCreateProjectTitleError(e);
    }
    let asSubproject;
    try {
      asSubproject = checkBoolean(createProjectAsSubproject);
    } catch (e) {
      errors++;
    }
    let addMembers;
    try {
      addMembers = checkBoolean(createProjectAddMembers);
    } catch (e) {
      errors++;
    }
    
    if (errors == 0) {
      async function fetchData() {
        try {
          const parentId = project && asSubproject ? `&parentId=${project}` : '';
          const { data } = await axios.post(`http://localhost:4000/projects?title=${title}${parentId}&addMembers=${addMembers}`);
          resetCreateProjectErrors();
          handleCreateProjectClose();
          setFetchFlag(true);
        } catch (e) {
          // TODO
          alert(e);
        }
      }
      fetchData();
    }
  }

  const handleJoinProjectOpen = () => {
    resetJoinProjectValues();
    resetJoinProjectErrors();
    setJoinProjectOpen(true);
  }
  const handleJoinProjectClose = () => {
    setJoinProjectOpen(false);
  }
  const handleJoinProjectSubmit = () => {
    let errors = 0;

    let id;
    try {
      id = checkString(joinProjectId);
    } catch (e) {
      errors++;
      setJoinProjectIdError(e);
    }

    if (errors == 0) {
      async function fetchData() {
        try {
          const { data } = await axios.post(`http://localhost:4000/projects/${id}/join`);
          resetJoinProjectErrors();
          handleJoinProjectClose();
          setFetchFlag(true);
        } catch (e) {
          setJoinProjectIdError(e.response.data.error);
        }
      }
      fetchData();
    }
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
          const { data } = await axios.post(`http://localhost:4000/users/logIn?email=${email}&password=${password}`);
          setUser(data);
          handleLogInClose();
          navigate('/');
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
          const { data } = await axios.post(`http://localhost:4000/users/signUp?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}&confirmPassword=${confirmPassword}&role=${role}`);
          if (data._id) {
            setUser(data);
            handleSignUpClose();
            navigate('/');
          } else {
            setUser(null);
          }
        } catch (e) {
          if (e.response && 'emailError' in e.response.data) setSignUpEmailError(e.response.data.error);
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
          await axios.get(`http://localhost:4000/users/logOut`);
        } catch (e) {
          
        }
        setUser(null);
        handleLogOutClose();
        navigate('/');
      }
      fetchData();
  }

  const handleCreateProjectTitleChange = (event) => {
    setCreateProjectTitle(event.target.value);
  }
  const handleCreateProjectAsSubprojectChange = (event) => {
    setCreateProjectAsSubproject(event.target.checked);
  }
  const handleCreateProjectAddMembersChange = (event) => {
    setCreateProjectAddMembers(event.target.checked);
  }

  const handleJoinProjectIdChange = (event) => {
    setJoinProjectId(event.target.value);
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

  const resetCreateProjectValues = () => {
    setCreateProjectTitle(null);
    setCreateProjectAsSubproject(false);
    setCreateProjectAddMembers(false);
  }
  const resetCreateProjectErrors = () => {
    hideCreateProjectTitleError();
  }
  const resetJoinProjectValues = () => {
    setJoinProjectId(null);
  }
  const resetJoinProjectErrors = () => {
    hideJoinProjectIdError();
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
    <div>
      {!loading &&
        <div className='App'>
          <Dialog open={createProjectOpen} onClose={handleCreateProjectClose} fullWidth maxWidth="xs">
            <DialogTitle>Create Project</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter a title for your project.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="Title"
                label="Title"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleCreateProjectTitleChange}
              />
              {createProjectTitleError && <Alert severity="error" onClose={hideCreateProjectTitleError}>{createProjectTitleError}</Alert>}

              {project &&
                <div>
                  <DialogContentText mt={1}>Specify relation to selected project.</DialogContentText>
                  <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={createProjectAsSubproject} />}
                        label="Create as subproject of selected project"
                        onChange={handleCreateProjectAsSubprojectChange}
                      />
                  </FormGroup>
                  <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={createProjectAddMembers} />}
                        label="Add all members of selected project"
                        onChange={handleCreateProjectAddMembersChange}
                        disabled={!createProjectAsSubproject}
                      />
                  </FormGroup>
                </div>
              }
              </DialogContent>
            <DialogActions>
              <Button onClick={handleCreateProjectClose}>Cancel</Button>
              <Button onClick={handleCreateProjectSubmit}>Submit</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={joinProjectOpen} onClose={handleJoinProjectClose} fullWidth maxWidth="xs">
            <DialogTitle>Join Project</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the ID of the project you want to join.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="ID"
                label="ID"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleJoinProjectIdChange}
              />
              {joinProjectIdError && <Alert severity="error" onClose={hideJoinProjectIdError}>{joinProjectIdError}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleJoinProjectClose}>Cancel</Button>
              <Button onClick={handleJoinProjectSubmit}>Submit</Button>
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
                <Typography variant="h6" noWrap component="div" as={Link} to={'/'} sx={{ color: 'white', textDecoration: 'none' }}>
                  Solar EPC Hub
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

                    {user && projects &&
                      <div>
                        {projects.map((project, index) => (
                          <ListItem key={project._id} disablePadding>
                            <ListItemButton as={Link} to={`/projects/${project._id}`} sx={{ color: 'black' }}>
                              <ListItemIcon sx={{ minWidth: 40 }} />
                              <ListItemText primary={project.title} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                        
                        {user.projects.length > 0 && <Divider />}
                      </div>
                    }

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
            <Box component="main" sx={{ pt: 2, pb: 2, pl: 4, pr: 4, width: '100%' }}>
              <Toolbar />
              <div className='App-body'>
                <Routes>
                  <Route path='/' element={<Home user={user} reset={() => setProject(null)} />} />
                  <Route path='/projects/:id' element={<Project user={user} projects={projects} reset={(id) => setProject(id)} />} />
                  <Route path='/error' element={<Error />} reset={() => setProject(null)} />
                  <Route path='*' element={<Navigate to={'/error'} replace />} reset={() => setProject(null)} />
                </Routes>
              </div>
            </Box>
          </Box>
        </div>
      }
    </div>
  );
}

export default App;
