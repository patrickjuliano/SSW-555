import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';

import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import Communications from './Communications';

const Task = ({ project, task, open, onClose, refetch, stages }) => {
	axios.defaults.withCredentials = true;

	const [owner, setOwner] = useState(undefined);
	const [selectedSubtask, setSelectedSubtask] = useState(null);
	const [fullyOpen, setFullyOpen] = useState(false);

	useEffect(() => {
		async function fetchData() {
			if (selectedSubtask) {
				const updatedSubtask = task.subtasks.find(updatedSubtask => updatedSubtask._id === selectedSubtask._id);
				setSelectedSubtask(updatedSubtask);
			}
		}
		fetchData()
	}, [ task ]);

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

				setSelectedSubtask(null);
				setFullyOpen(true);
			}
		}
		fetchData();
	}, [open]);

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
				<Dialog open={fullyOpen} onClose={closeTask} scroll="body" fullWidth maxWidth="md">
					<DialogTitle>
						{task.title}
						<IconButton onClick={closeTask} aria-label="Close task" sx={{ position: 'absolute', right: 12, top: 12 }}>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
					<DialogContent dividers>
						<DialogContentText sx={{ fontWeight: "bold", color: "text.primary" }}>Description</DialogContentText>
						<DialogContentText mb={1}>{task.description}</DialogContentText>
						<DialogContentText sx={{ fontWeight: "bold", color: "text.primary" }}>Due Date</DialogContentText>
						<DialogContentText mb={1}>{new Date(task.dueDate).toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'})}</DialogContentText>
						<DialogContentText sx={{ fontWeight: "bold", color: "text.primary" }}>Stage</DialogContentText>
						<DialogContentText mb={1}>{stages[task.stage]}</DialogContentText>
						<DialogContentText sx={{ fontWeight: "bold", color: "text.primary" }}>Owner</DialogContentText>
						<DialogContentText mb={1}>{owner ? `${owner.firstName} ${owner.lastName} (${owner.email})` : 'None'}</DialogContentText>
					</DialogContent>
					{task.subtasks && task.subtasks.length > 0 &&
						<DialogContent>
							<h3 style={{ margin: 0, padding: 0 }}>Subtasks</h3>
							{/* <DialogContentText sx={{ fontWeight: "bold" }}>Subtasks</DialogContentText> */}
							<List>
								{task.subtasks.map((subtask, index) => (
									<ListItem key={`subtask-${index}`} disablePadding>
										{/* <ListItemButton dense onClick={() => setSelectedSubtask(subtask === selectedSubtask ? null : subtask)} sx={{ p: 0 }}> */}
											<ListItemIcon>
												<Checkbox checked={subtask.done} onChange={(event) => toggleSubtask(task._id, subtask._id, event.target.checked)} />
											</ListItemIcon>
											<ListItemText primary={subtask.description} primaryTypographyProps={{ variant: "body1" }} />
										{/* </ListItemButton> */}
										{/* <ListItemButton dense onClick={() => setSelectedSubtask(subtask === selectedSubtask ? null : subtask)} sx={{ p: 0 }}> */}
											{/* <ListItemText primary={subtask.description} primaryTypographyProps={{ variant: "body1" }} /> */}
										{/* </ListItemButton> */}
										<ListItemSecondaryAction>
											<IconButton onClick={() => setSelectedSubtask(selectedSubtask && subtask._id === selectedSubtask._id ? null : subtask)}>
												{selectedSubtask && subtask._id === selectedSubtask._id ? <CloseIcon /> : <CommentIcon />}
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						</DialogContent>
					}
					{task.comments &&
						<DialogContent dividers>
							<Communications project={project} task={task} subtask={selectedSubtask} deselectSubtask={() => setSelectedSubtask(null)} refetch={refetch} />
						</DialogContent>
					}
				</Dialog>
			}
		</div>
	);
};

export default Task;