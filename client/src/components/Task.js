import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import '../App.css';

const Task = ({ task, open, onClose }) => {
	axios.defaults.withCredentials = true;

	return (
		<div>
			{task &&
				<Dialog open={open} onClose={onClose}>
					<DialogTitle>{task.title}</DialogTitle>
					<DialogContent>
						<DialogContentText>{task.description}</DialogContentText>
					</DialogContent>
				</Dialog>
			}
		</div>
	);
};

export default Task;