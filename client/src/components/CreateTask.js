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

	const [subtasks, setSubtasks] = useState([]);
	const onSubtaskAdd = () => {
		setSubtasks(state => [...state, ""]);
		setSubtaskErrors(state => [...state, null]);
	}
	const onSubtaskRemove = (index) => {
		setSubtasks(state => state.filter((_, i) => i !== index));
		setSubtaskErrors(state => state.filter((_, i) => i !== index));
	}
	const onSubtaskChange = (value, index) => {
		const data = [...subtasks];
		data[index] = value;
		setSubtasks(data);
	}
	const [subtaskErrors, setSubtaskErrors] = useState([]);
	const onSubtaskErrorClose = (index) => {
		const data = [...subtaskErrors];
		data[index] = null;
		setSubtaskErrors(data);
	}

	const resetValues = () => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description);
			setSubtasks([]);
		} else {
			setTitle(null);
			setDescription(null);
			setSubtasks([]);
		}
	}
	const resetErrors = () => {
		setTitleError(null);
		setDescriptionError(null);
		setSubtaskErrors([]);
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
			setTitleError(null);
		} catch (e) {
			errors++;
			setTitleError(e);
		}
		try {
			var newDescription = checkString(description);
			setDescriptionError(null);
		} catch (e) {
			errors++;
			setDescriptionError(e);
		}
		const localSubtasks = [...subtasks];
		const localSubtaskErrors = [...subtaskErrors];
		for (let i = 0; i < localSubtasks.length; i++) {
			try {
				localSubtasks[i] = checkString(localSubtasks[i]);
				localSubtaskErrors[i] = null;
			} catch (e) {
				errors++;
				localSubtaskErrors[i] = e;
			}
		}
		setSubtaskErrors(localSubtaskErrors);

		if (errors == 0) {
			async function fetchData() {
				try {
					let subtaskString = '';
					for (let i = 0; i < localSubtasks.length; i++) {
						subtaskString += `&subtask=${localSubtasks[i]}`;
					}
					const { data } = task ? 
						await axios.put(`http://localhost:4000/tasks/${task._id}?title=${newTitle}&description=${newDescription}`) :
						await axios.post(`http://localhost:4000/tasks?projectId=${project._id}&title=${newTitle}&description=${newDescription}${subtaskString}`);
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
					{subtasks.map((subtask, index) => (
						<ListItem disablePadding>
							<ListItemButton onClick={() => onSubtaskRemove(index)} sx={{ p: 1 }}>
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
								value={subtasks[index]}
								onChange={(event) => onSubtaskChange(event.target.value, index)}
							/>
							{subtaskErrors[index] && <Alert severity="error" onClose={() => onSubtaskErrorClose(index)}>{subtaskErrors[index]}</Alert>}
						</ListItem>
					))}

					<ListItem disablePadding>
						<ListItemButton onClick={onSubtaskAdd} sx={{ p: 1 }}>
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