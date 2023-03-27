import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import { checkBoolean, checkString } from '../validation';

const UploadPhoto = ({ project, refetch, open, onClose, photo }) => {
	axios.defaults.withCredentials = true;

	const [fullyOpen, setFullyOpen] = useState(false);

	const [src, setSrc] = useState(null);
	const onSrcChange = (event) => setSrc(event.target.value);
	const [srcError, setSrcError] = useState(null);

	const resetValues = () => {
		setSrc(photo.src)
	}
	const resetErrors = () => {
		setSrcError(null);
	}
	useEffect(() => {
		if (open) {
			resetValues();
			resetErrors();

			setFullyOpen(true);
		}
	}, [open]);

	const closeForm = () => {
		setFullyOpen(false);
		onClose();
	}

	const onSubmit = () => {
		async function fetchData() {
			try {
				const remove = !src || !src.trim();
				const { data } = remove ?
					await axios.delete(`http://localhost:4000/photos/${photo._id}/upload`) :
					await axios.patch(`http://localhost:4000/photos/${photo._id}/upload/${src.replaceAll('/', '|')}`);
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
		<Dialog open={fullyOpen} onClose={closeForm}>
			<DialogTitle>Upload Photo</DialogTitle>
			<DialogContent>
				<DialogContentText>Enter the URL of the photo you want to upload.</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="URL"
					label="URL"
					type="text"
					variant="standard"
					fullWidth
					value={src}
					onChange={onSrcChange}
				/>
				{srcError && <Alert severity="error" onClose={() => setSrcError(null)}>{srcError}</Alert>}
			</DialogContent>
			<DialogActions>
				<Button onClick={closeForm}>Cancel</Button>
				<Button onClick={onSubmit}>Submit</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UploadPhoto;