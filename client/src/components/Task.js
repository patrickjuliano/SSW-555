import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';

import CloseIcon from '@mui/icons-material/Close';

const Task = ({ task, open, onClose, refetch, stages }) => {
	axios.defaults.withCredentials = true;

	const [owner, setOwner] = useState(undefined);
	const [fullyOpen, setFullyOpen] = useState(false);

	useEffect(() => {
		async function fetchData() {
			if (open) {
				try {
					if (task.ownerId) {
						const { data } = await axios.get(`http://localhost:4000/users/${task.ownerId}`);
						setOwner(data);
					} else {
						setOwner(null);
					}
				} catch (e) {
					// TODO
					alert(e);
				}
			}
		}
		fetchData();
	}, [open]);

	useEffect(() => {
		async function fetchData() {
			if (owner !== undefined) {
				setFullyOpen(true);
			}
		}
		fetchData();
	}, [owner]);

	async function toggleSubtask(taskId, subtaskId, done) {
		try {
			const { data } = await axios.patch(`http://localhost:4000/tasks/${taskId}/subtasks/${subtaskId}?done=${done}`);
			refetch();
		} catch (e) {
			// TODO
			alert(e);
		}
	}

	const closeTask = () => {
		setFullyOpen(false);
		onClose();
	}

	return (
		<div>
			{task &&
				<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
					<DialogTitle>
						{task.title}
						<IconButton onClick={closeTask} aria-label="Close task" sx={{ position: 'absolute', right: 12, top: 12 }}>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
					<DialogContent dividers>
						<DialogContentText sx={{ fontWeight: "bold"}}>Description</DialogContentText>
						<DialogContentText mb={1}>{task.description}</DialogContentText>
						<DialogContentText sx={{ fontWeight: "bold" }}>Stage</DialogContentText>
						<DialogContentText mb={1}>{stages[task.stage]}</DialogContentText>
						<DialogContentText sx={{ fontWeight: "bold" }}>Owner</DialogContentText>
						<DialogContentText mb={1}>{owner ? `${owner.firstName} ${owner.lastName} (${owner.email})` : 'None'}</DialogContentText>
					</DialogContent>
					{task.subtasks && task.subtasks.length > 0 &&
						<DialogContent>
							<DialogContentText sx={{ fontWeight: "bold" }}>Subtasks</DialogContentText>
							<List>
								{task.subtasks.map((subtask, index) => (
									<ListItem key={`subtask-${index}`} disablePadding>
										<ListItemButton dense>
											<ListItemIcon>
												<Checkbox checked={subtask.done} onChange={(event) => toggleSubtask(task._id, subtask._id, event.target.checked)} />
											</ListItemIcon>
											<ListItemText primary={subtask.description} primaryTypographyProps={{ variant: "body1" }} />
										</ListItemButton>
									</ListItem>
								))}
							</List>
						</DialogContent>
					}
				</Dialog>
			}
		</div>
	);
};

export default Task;