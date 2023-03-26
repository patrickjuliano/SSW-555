import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import { checkBoolean, checkString } from '../validation';

const CreatePhoto = ({ project, refetch, open, onClose }) => {
	axios.defaults.withCredentials = true;

	const [title, setTitle] = useState(null);
	const onTitleChange = (event) => setTitle(event.target.value);
	const [titleError, setTitleError] = useState(null);

	const [required, setRequired] = useState(null);
	const onRequiredChange = (event) => setRequired(event.target.checked);
	const [requiredError, setRequiredError] = useState(null);

	const resetValues = () => {
		setTitle(null);
		setRequired(false);
	}
	const resetErrors = () => {
		setTitleError(null);
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
			var newRequired = checkBoolean(required);
		} catch (e) {
			errors++;
			setRequiredError(e);
		}

		if (errors == 0) {
			async function fetchData() {
				try {
					const { data } = await axios.post(`http://localhost:4000/photos?projectId=${project._id}&title=${newTitle}&required=${newRequired}`);
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
			<DialogTitle>Create Photo</DialogTitle>
			<DialogContent>
				<DialogContentText>Please enter a title for the photo.</DialogContentText>
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
				
				<DialogContentText mt={1}>Please specify whether the photo is required.</DialogContentText>
				<FormGroup>
  					<FormControlLabel control={<Checkbox />} label="Required" onChange={onRequiredChange} />
				</FormGroup>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onSubmit}>Submit</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreatePhoto;