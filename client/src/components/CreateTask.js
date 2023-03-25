import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import { checkBoolean, checkString } from '../validation';

const CreateTask = ({ project, refetch, open, onClose }) => {
	axios.defaults.withCredentials = true;

	const [title, setTitle] = useState(null);
	const onTitleChange = (event) => setTitle(event.target.value);
	const [titleError, setTitleError] = useState(null);

	const [description, setDescription] = useState(null);
	const onDescriptionChange = (event) => setDescription(event.target.value);
	const [descriptionError, setDescriptionError] = useState(null);

	const resetValues = () => {
		setTitle(null);
		setDescription(false);
	}
	const resetErrors = () => {
		setTitleError(null);
		setDescriptionError(null);
	}
	useEffect(() => {
		if (open) {
			resetValues();
			resetErrors();
		}
	}, [open]);

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
					const { data } = await axios.post(`http://localhost:4000/tasks?projectId=${project._id}&title=${newTitle}&description=${newDescription}`);
					refetch();
					onClose();
				} catch (e) {
					// TODO
					alert(e);
				}
			}
			fetchData();
		}
	}

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Create Task</DialogTitle>
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
					onChange={onTitleChange}
				/>
				{titleError && <Alert severity="error" onClose={() => setTitleError(null)}>{titleError}</Alert>}

				<DialogContentText>Please enter a description for the task.</DialogContentText>
				<TextField
					margin="dense"
					id="Description"
					label="Description"
					type="text"
					variant="standard"
					fullWidth
					onChange={onDescriptionChange}
				/>
				{descriptionError && <Alert severity="error" onClose={() => setDescriptionError(null)}>{descriptionError}</Alert>}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onSubmit}>Submit</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateTask;