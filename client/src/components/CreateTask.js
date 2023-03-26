import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, List, ListItem, ListItemButton, ListItemIcon, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import { checkBoolean, checkString } from '../validation';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CreateTask = ({ project, refetch, open, onClose, task }) => {
	axios.defaults.withCredentials = true;

	const [fullyOpen, setFullyOpen] = useState(false);

	const [title, setTitle] = useState(null);
	const onTitleChange = (event) => setTitle(event.target.value);
	const [titleError, setTitleError] = useState(null);

	const [description, setDescription] = useState(null);
	const onDescriptionChange = (event) => setDescription(event.target.value);
	const [descriptionError, setDescriptionError] = useState(null);

	const resetValues = () => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description);
		} else {
			setTitle(null);
			setDescription(null);
		}
	}
	const resetErrors = () => {
		setTitleError(null);
		setDescriptionError(null);
	}
	useEffect(() => {
		if (open) {
			resetValues();
			resetErrors();

			setFullyOpen(true);
		}
	}, [open]);

	const closeTask = () => {
		setFullyOpen(false);
		onClose();
	}

	const onSubmit = () => {
		let errors = 0;

		try {
			var newTitle = checkString(title);
		} catch (e) {
			errors++;
			setTitleError(e);
		}
		try {
			var newDescription = checkString(description);
		} catch (e) {
			errors++;
			setDescriptionError(e);
		}

		if (errors == 0) {
			async function fetchData() {
				try {
					const { data } = task ? 
						await axios.put(`http://localhost:4000/tasks/${task._id}?title=${newTitle}&description=${newDescription}`) :
						await axios.post(`http://localhost:4000/tasks?projectId=${project._id}&title=${newTitle}&description=${newDescription}`);
					refetch();
					closeTask();
				} catch (e) {
					// TODO
					alert(e);
				}
			}
			fetchData();
		}
	}

	return (
		<Dialog open={fullyOpen} onClose={closeTask} fullWidth maxWidth="sm">
			<DialogTitle>{task ? "Edit" : "Create"} Task</DialogTitle>
			<DialogContent>
				<DialogContentText>Please enter a title for the task.</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="Title"
					label="Title"
					type="text"
					variant="standard"
					fullWidth
					value={title}
					onChange={onTitleChange}
				/>
				{titleError && <Alert severity="error" onClose={() => setTitleError(null)}>{titleError}</Alert>}

				<DialogContentText mt={1}>Please enter a description for the task.</DialogContentText>
				<TextField
					margin="dense"
					id="Description"
					label="Description"
					type="text"
					variant="standard"
					fullWidth
					value={description}
					onChange={onDescriptionChange}
				/>
				{descriptionError && <Alert severity="error" onClose={() => setDescriptionError(null)}>{descriptionError}</Alert>}
				
				{/* <DialogContentText mt={1}>Please enter a due date for the task.</DialogContentText>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker />
				</LocalizationProvider> */}

				<DialogContentText mt={1}>If applicable, enter any subtasks associated with this task.</DialogContentText>
				<List disablePadding>
					<ListItem disablePadding>
						<ListItemButton sx={{ p: 1 }}>
							<ListItemIcon>
								<RemoveCircleIcon />
							</ListItemIcon>
						</ListItemButton>
						<TextField
							margin="dense"
							label="Subtask"
							type="text"
							variant="standard"
							fullWidth
						/>
					</ListItem>

					<ListItem disablePadding>
						<ListItemButton sx={{ p: 1 }}>
							<ListItemIcon>
								<AddCircleIcon />
							</ListItemIcon>
						</ListItemButton>
						<TextField
							margin="dense"
							label="Subtask"
							type="text"
							variant="standard"
							fullWidth
							disabled
						/>
					</ListItem>
				</List>
				
			</DialogContent>
			<DialogActions>
				<Button onClick={closeTask}>Cancel</Button>
				<Button onClick={onSubmit}>Submit</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateTask;