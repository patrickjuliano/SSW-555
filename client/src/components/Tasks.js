import { Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material';
import { create } from '@mui/material/styles/createTransitions';
import axios from 'axios';
import React, { useState } from 'react';
import '../App.css';
import Confirmation from './Confirmation';
import CreateTask from './CreateTask';

const Tasks = ({ project, refetch }) => {
	axios.defaults.withCredentials = true;

	const [createTaskOpen, setCreateTaskOpen] = useState(false);
	const openCreateTask = () => setCreateTaskOpen(true);
	const closeCreateTask = () => setCreateTaskOpen(false);

	const [deleteTaskId, setDeleteTaskId] = useState(null);
	async function deleteTask() {
		try {
			const { data } = await axios.delete(`http://localhost:4000/tasks/${deleteTaskId}`);
			refetch();
			setDeleteTaskId(null);
		} catch (e) {
			// TODO
			alert(e);
		}
	}

	const stages = ["Backlog", "To Do", "In Progress", "Done"]

	const getTasksAtStage = (stage) => {
		const tasks = [];
		for (let i = 0; i < project.tasks.length; i++) {
			const task = project.tasks[i];
			if (task.stage === stage) tasks.push(task);
		}

		return (
			<Grid item xs={3}>
				<Card variant="outlined" sx={{ p: 2, backgroundColor: '#F4F5F7' }}>
					<Typography variant="h6" component="h4" sx={{ pb: 1 }}>{stages[stage]}</Typography>
					<Grid container spacing={1} direction="column" justifyContent="flex-start" alignItems="stretch">
						{tasks.map((task, index) => (
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">{task.title}</Typography>
										<Typography variant="body2">{task.description}</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Card>
			</Grid>
		);
	}

	const createTaskColumns = () => {
		return (
			<Grid container spacing={2}>
				{stages.map((stage, index) => (
					getTasksAtStage(index)
				))}
			</Grid>
		);
	}

	return (
		<div>
			<div style={{ display: 'flex', alignItems: 'center', columnGap: 12 }}>
				<h3>Tasks</h3>
				<Button variant="contained" onClick={openCreateTask}>Create Task</Button>
			</div>
			<CreateTask project={project} refetch={refetch} open={createTaskOpen} onClose={closeCreateTask} />
			<Confirmation
				title="Delete Task"
				body="Are you sure you want to delete this task?"
				open={deleteTaskId}
				onClose={() => setDeleteTaskId(null)}
				onSubmit={deleteTask}
			/>

			{project.tasks && createTaskColumns()}

			{/* <Grid container spacing={2}>
				<Grid item xs={3}>
					<Card variant="outlined" sx={{ p: 2, backgroundColor: '#F4F5F7' }}>
						<Typography variant="h6" component="h4" sx={{ pb: 1 }}>Backlog</Typography>
						<Grid container spacing={1} direction="column" justifyContent="flex-start" alignItems="stretch">
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Card>
				</Grid>

				<Grid item xs={3}>
					<Card variant="outlined" sx={{ p: 2, backgroundColor: '#F4F5F7'  }}>
						<Typography variant="h6" component="h4" sx={{ pb: 1 }}>To Do</Typography>
						<Grid container spacing={1} direction="column" justifyContent="flex-start" alignItems="stretch">
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Card>
				</Grid>

<Grid item xs={3}>
					<Card variant="outlined" sx={{ p: 2, backgroundColor: '#F4F5F7'  }}>
						<Typography variant="h6" component="h4" sx={{ pb: 1 }}>In Progress</Typography>
						<Grid container spacing={1} direction="column" justifyContent="flex-start" alignItems="stretch">
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Card>
				</Grid>

<Grid item xs={3}>
					<Card variant="outlined" sx={{ p: 2, backgroundColor: '#F4F5F7'  }}>
						<Typography variant="h6" component="h4" sx={{ pb: 1 }}>Done</Typography>
						<Grid container spacing={1} direction="column" justifyContent="flex-start" alignItems="stretch">
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="h6" component="div">Task</Typography>
										<Typography variant="body2">This is a task!</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Card>
				</Grid>



				
			</Grid> */}
			
			
		</div>
	);
};

export default Tasks;