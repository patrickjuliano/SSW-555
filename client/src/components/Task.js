import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import '../App.css';

const Task = ({ task, open, onClose, refetch }) => {
	axios.defaults.withCredentials = true;

	async function toggleSubtask(taskId, subtaskId, done) {
		try {
			const { data } = await axios.patch(`http://localhost:4000/tasks/${taskId}/subtasks/${subtaskId}?done=${done}`);
			refetch();
		} catch (e) {
			// TODO
			alert(e);
		}
	}

	return (
		<div>
			{task &&
				<Dialog open={open} onClose={onClose} fullWidth>
					<DialogTitle>{task.title}</DialogTitle>
					<DialogContent dividers>
						<DialogContentText sx={{ fontWeight: "bold" }}>Description</DialogContentText>
						<DialogContentText>{task.description}</DialogContentText>
					</DialogContent>
					{task.subtasks && task.subtasks.length > 0 &&
						<DialogContent>
							<DialogContentText sx={{ fontWeight: "bold" }}>Subtasks</DialogContentText>
							<List>
								{task.subtasks.map((subtask, index) => (
									<ListItem
										key={`subtask-${index}`}
										disablePadding
									>
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