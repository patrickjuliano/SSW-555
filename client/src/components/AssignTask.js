import { Alert, Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, List, ListItem, ListItemButton, ListItemIcon, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import { checkBoolean, checkString } from '../validation';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AssignTask = ({ project, refetch, open, onClose, task }) => {
	axios.defaults.withCredentials = true;

	const [fullyOpen, setFullyOpen] = useState(false);

	const [users, setUsers] = useState(null);
	const [ownerId, setOwnerId] = useState(null);
	const onOwnerChange = (event, user) => {
		setOwnerId(user ? user._id : "");
	}

	const resetValues = () => {
		setUsers(null);
		setOwnerId(task.ownerId);
	}

	useEffect(() => {
		async function fetchData() {
			if (open) {
				resetValues();
			}
		}
		fetchData();
	}, [open]);

	useEffect(() => {
		async function fetchData() {
			if (users === null && ownerId !== null) {
				try {
					const { data } = await axios.get(`http://localhost:4000/projects/${project._id}/users`);
					
					const updatedUsers = [];
					for (let i = 0; i < data.length; i++) {
						const user = data[i];
						const updatedUser = { label: `${user.firstName} ${user.lastName} (${user.email})`, _id: user._id }
						updatedUsers.push(updatedUser);
					}
					setUsers(updatedUsers);
					setFullyOpen(true);
				} catch (e) {
					// TODO
					alert(e);
				}
			}
		}
		fetchData();
	}, [users, ownerId]);

	const closeForm = () => {
		setFullyOpen(false);
		onClose();
	}

	const onSubmit = () => {
		async function fetchData() {
			try {
				const { data } = ownerId ?
					await axios.patch(`http://localhost:4000/tasks/${task._id}/users/${ownerId}`) :
					await axios.delete(`http://localhost:4000/tasks/${task._id}/users`);
				refetch();
				closeForm();
			} catch (e) {
				// TODO
				alert(e);
			}
		}
		fetchData();
	}

	return (
		<Dialog open={fullyOpen} onClose={closeForm} fullWidth maxWidth="xs">
			
				<DialogTitle>Assign Task</DialogTitle>
				<DialogContent>
					<DialogContentText mb={1}>Assign a user as the owner of this task.</DialogContentText>
					<Autocomplete
						value={users && ownerId ? users.find(user => user._id === ownerId).label : null}
						onChange={onOwnerChange}
						options={users}
						renderInput={(params) => <TextField {...params} label="User" />}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeForm}>Cancel</Button>
					<Button onClick={onSubmit}>Submit</Button>
				</DialogActions>
		</Dialog>
	);
};

export default AssignTask;