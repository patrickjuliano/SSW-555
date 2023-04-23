import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import KPI from '../components/KPI';
import { Button, Divider, Grid, InputAdornment, List, ListItem, ListItemText, TextField, Tooltip, Typography } from '@mui/material';

const Activity = ({ project, task, subtask, deselectSubtask, refetch }) => {
	axios.defaults.withCredentials = true;

	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [content, setContent] = useState("");

	const object = subtask ? subtask : task ? task : project;

	const getUser = (id) => {
		const user = users.find(u => u._id === id);
		return user === undefined ? 'Unknown' : `${user.firstName} ${user.lastName}`;
	}

	const formatMessage = (message) => {
		const startingIndex = message.indexOf("[");
		return <span>
			<Typography
				sx={{ display: 'inline', mr: .5  }}
				component="span"
			>
				{message.slice(0, startingIndex - 1)}
			</Typography>
			<Typography
				sx={{ display: 'inline', fontWeight: 'bold', color: 'text.secondary'}}
				component="span"
			>
				{message.slice(startingIndex, message.length)}
			</Typography>
		</span>;
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

	return (
		<div>
			{object == project &&
				<KPI 
					project={project}
					refetch={refetch}
				/>
			}
            <h3 style={{ marginBottom: 0 }}>Activity
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
			{loading ? "Loading..." : <List>
				{project.activity.slice(0).reverse().map((message, index) => (
					<li>
						<ListItem>
							<ListItemText 
								primary={
									<React.Fragment>
										<Typography
											sx={{ display: 'inline', fontWeight: 'bold', mr: .5 }}
											component="span"
										>
											{getUser(message.userId)}
										</Typography>
										{formatMessage(message.content)}
									</React.Fragment>
								}
								secondary={
									<React.Fragment>
										<Typography
											sx={{ display: 'inline' }}
											component="span"
											variant="body2"
											color="text.secondary"
										>
											{`${new Date(message.date).toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'})} at ${new Date(message.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
										</Typography>
									</React.Fragment>
								}
							/>
						</ListItem>
						{index < project.activity.length - 1 && <Divider />}
					</li>
				))}
			</List>}
		</div>
	);
};

export default Activity;