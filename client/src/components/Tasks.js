import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { create } from '@mui/material/styles/createTransitions';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import Confirmation from './Confirmation';
import CreateTask from './CreateTask';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Delete from '@mui/icons-material/Delete';
import Settings from '@mui/icons-material/Settings';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import Task from './Task';
import AssignTask from './AssignTask';
import dayjs from 'dayjs';

const descriptionCharacterLimit = 100;

const Tasks = ({ project, refetch }) => {
	axios.defaults.withCredentials = true;

	const [task, setTask] = useState(null);
	const [taskOpen, setTaskOpen] = useState(false);
	const openTask = (task) => {
		setTask(task);
		setTaskOpen(true);
	}

	useEffect(() => {
		async function fetchData() {
			if (task) {
				const updatedTask = project.tasks.find(updatedTask => updatedTask._id === task._id);
				setTask(updatedTask);
			}
		}
		fetchData()
	}, [ project ]);

	const [createTaskOpen, setCreateTaskOpen] = useState(false);
	const openCreateTask = () => {
		setTask(null);
		setCreateTaskOpen(true);
	}
	const openEditTask = (task) => {
		setTask(task);
		setCreateTaskOpen(true);
	}
	const closeCreateTask = () => setCreateTaskOpen(false);

	const [assignTaskOpen, setAssignTaskOpen] = useState(false);
	const openAssignTask = (task) => {
		setTask(task);
		setAssignTaskOpen(true);
	}
	const closeAssignTask = () => setAssignTaskOpen(false);

	const [deleteTaskId, setDeleteTaskId] = useState(null);
	async function deleteTask() {
		try {
			const { data } = await axios.delete(`http://localhost:4000/tasks/${deleteTaskId}`);
			setDeleteTaskId(null);
			refetch();
		} catch (e) {
			// TODO
			alert(e);
		}
	}

	async function moveTask(taskId, forward) {
		try {
			const { data } = await axios.patch(`http://localhost:4000/tasks/${taskId}/move/${forward}`);
			refetch();
		} catch (e) {
			// TODO
			alert(e);
		}
	}
	async function moveTaskBackward(taskId) { await moveTask(taskId, false); }
	async function moveTaskForward(taskId) { await moveTask(taskId, true); }

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
									<CardActionArea component="button" onClick={() => openTask(task)}>
										<CardContent>
											<Typography variant="h6" component="div" style={{
												display: 'flex',
												alignItems: 'center',
												flexWrap: 'wrap',
											}}>
												<span style={{ marginRight: 3 }}>{task.title}</span>
												{createReminderIcon(task.stage, task.dueDate)}
											</Typography>
											<Typography variant="body2">{task.description.substring(0, descriptionCharacterLimit)}{task.description.length > descriptionCharacterLimit && '...'}</Typography>
										</CardContent>
									</CardActionArea>
									<CardActions disableSpacing>
										{stage !== 0 &&
											<Tooltip title={`${stages[stage]} → ${stages[stage - 1]}`}>
												<IconButton onClick={() => moveTaskBackward(task._id)} component="label" aria-label="Move task to previous stage">
													<ArrowBackIcon />
												</IconButton>
											</Tooltip>
										}
										{stage !== stages.length - 1 &&
											<Tooltip title={`${stages[stage]} → ${stages[stage + 1]}`}>
												<IconButton onClick={() => moveTaskForward(task._id)} component="label" aria-label="Move task to next stage">
													<ArrowForwardIcon />
												</IconButton>
											</Tooltip>
										}
										{true &&
											<Tooltip title="Assign Task">
												<IconButton onClick={() => openAssignTask(task)} component="label" aria-label="Assign task" sx={{ marginLeft: 'auto' }}>
													<PersonAddIcon />
												</IconButton>
											</Tooltip>
										}
										{true &&
											<Tooltip title="Edit Task">
												<IconButton onClick={() => openEditTask(task)} component="label" aria-label="Edit task">
													<Settings />
												</IconButton>
											</Tooltip>
										}
										{true &&
											<Tooltip title="Delete Task">
												<IconButton onClick={() => setDeleteTaskId(task._id)} component="label" aria-label="Delete task">
													<Delete />
												</IconButton>
											</Tooltip>
										}
									</CardActions>
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

	const createReminderIcon = (stage, dueDate) => {
		if (stage >= stages.length - 1 || !dueDate) return null;
		const diff = dayjs(dueDate).diff(dayjs(), "day");
		return diff <= 0 ? <AssignmentLateIcon color={diff === 0 ? "warning" : "error"} /> : null;
	}

	return (
		<div>
			<div style={{ display: 'flex', alignItems: 'center', columnGap: 12 }}>
				<h3>Tasks</h3>
				<Button variant="contained" onClick={openCreateTask}>Create Task</Button>
			</div>
			<CreateTask 
				project={project}
				refetch={refetch}
				open={createTaskOpen}
				onClose={closeCreateTask}
				task={task}
			/>
			<AssignTask 
				project={project}
				refetch={refetch}
				open={assignTaskOpen}
				onClose={closeAssignTask}
				task={task}
			/>
			<Confirmation
				title="Delete Task"
				body="Are you sure you want to delete this task?"
				open={deleteTaskId}
				onClose={() => setDeleteTaskId(null)}
				onSubmit={deleteTask}
			/>
			<Task
				project={project}
				task={task}
				open={taskOpen}
				onClose={() => setTaskOpen(false)}
				refetch={refetch}
				stages={stages}
			/>

			{project.tasks && createTaskColumns()}
		</div>
	);
};

export default Tasks;