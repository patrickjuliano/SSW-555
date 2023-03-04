import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';
import '../App.css';

const Confirmation = ({ title, body, open, onClose, onSubmit }) => {
	return (
		<Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
            	<DialogContentText>{body}</DialogContentText>
            </DialogContent>
            <DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onSubmit}>Confirm</Button>
            </DialogActions>
		</Dialog>
	);
};

export default Confirmation;
