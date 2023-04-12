import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Subprojects = ({ subprojects, whitelist, open, onClose, refetch }) => {
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
						<Tooltip title={!whitelist.includes(subproject._id) ? 'You do not have permission to view this project.' : ''} followCursor>
							<span>
								<ListItemButton onClick={() => redirect(subproject._id)} disabled={!whitelist.includes(subproject._id)}>
									<ListItemText primary={subproject.title} />
								</ListItemButton>
							</span>
						</Tooltip>
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
