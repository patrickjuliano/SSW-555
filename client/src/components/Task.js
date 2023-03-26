import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import '../App.css';

const Task = ({ task, open, onClose }) => {
	axios.defaults.withCredentials = true;

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
												<Checkbox />
											</ListItemIcon>
											<ListItemText checked={subtask.done} primary={subtask.description} primaryTypographyProps={{ variant: "body1" }} />
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