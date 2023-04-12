import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Subprojects = ({ subprojects, open, onClose, refetch }) => {
	const navigate = useNavigate();

	const redirect = (projectId) => {
		navigate(`/projects/${projectId}`);
		onClose();
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Subprojects</DialogTitle>
            <DialogContent>
            	<List>
					{subprojects.map((subproject, index) => (
						<ListItemButton onClick={() => redirect(subproject._id)}>
							<ListItemText primary={subproject.title} />
						</ListItemButton>
					))}
				</List>
            </DialogContent>
            <DialogActions>
				<Button onClick={onClose}>Close</Button>
            </DialogActions>
		</Dialog>
	);
};

export default Subprojects;
