import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button, Divider, Grid, InputAdornment, List, ListItem, ListItemText, TextField, Tooltip, Typography } from '@mui/material';
import { json } from 'react-router-dom';

const Communications = ({ project, task, subtask, deselectSubtask, refetch }) => {
	axios.defaults.withCredentials = true;

	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [content, setContent] = useState("");

	const object = subtask ? subtask : task ? task : project;

	const getUser = (id) => {
		const user = users.find(u => u._id === id);
		return user === undefined ? 'Unknown' : `${user.firstName} ${user.lastName}`;
	}



	useEffect(() => {
		async function fetchData() {
			setLoading(true);

			try {
				const { data } = await axios.get(`http://localhost:4000/projects/${project._id}/users`);
				setUsers(data);
				setLoading(false);
			} catch (e) {
				// TODO
				alert(e);
				refetch();
			}
		}
		fetchData()
	}, [ project, task, subtask ]);

	const onSubmit = () => {
		async function fetchData() {
			try {
				const route = subtask ? `subtasks/${task._id}/${subtask._id}` : task ? `tasks/${task._id}` : `projects/${project._id}`;
				const { data } = await axios.post(`http://localhost:4000/comments/${route}?content=${content}`);
				setContent("");
				refetch();
			} catch (e) {
				// TODO
				alert(e);
			}
		}
		fetchData();
	}

	return (
		<div>
            <h3 style={{ marginTop: task ? 0 : "1em" }}>Communications
				{task &&
					<Typography
						sx={{ display: 'inline', pl: 1 }}
						component="span"
						variant="body1"
						color="text.secondary"
					>
						<Typography onClick={subtask ? deselectSubtask : undefined} sx={{ display: 'inline', cursor: subtask ? 'pointer' : 'auto' }} component="span">{task.title}</Typography> {subtask && `❯ ${subtask.description}`}
					</Typography>
				}
			</h3>
			{!loading &&
				<TextField 
					label="Add a comment..."
					type="text"
					fullWidth
					value={content}
					onChange={(event) => setContent(event.target.value)}
					InputProps={{ endAdornment: <InputAdornment><Button variant="contained" onClick={onSubmit} disabled={content.trim().length === 0}>Comment</Button></InputAdornment> }}
				/>
			}
			{loading ? "Loading..." : <List>
				{object.comments.slice(0).reverse().map((comment, index) => (
					<li>
						<ListItem>
							<ListItemText 
								primary={
									<React.Fragment>
										<Typography
											sx={{ display: 'inline', fontWeight: 'bold', mr: .5 }}
											component="span"
										>
											{getUser(comment.userId)}
										</Typography>
										<Tooltip title={new Date(comment.date).toLocaleTimeString()} placement="top">
											<Typography
												sx={{ display: 'inline' }}
												component="span"
												variant="body2"
												color="text.secondary"
											>
												{new Date(comment.date).toLocaleDateString()}
											</Typography>
										</Tooltip>
									</React.Fragment>
								}
								secondary={
									<React.Fragment>
										<Typography
											sx={{ display: 'inline' }}
											component="span"
											variant="body2"
											color="text.primary"
										>
											{comment.content}
										</Typography>
									</React.Fragment>
								}
							/>
						</ListItem>
						{index < object.comments.length - 1 && <Divider />}
					</li>
				))}
			</List>}
		</div>
	);
};

export default Communications;