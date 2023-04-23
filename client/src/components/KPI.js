import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Box, Button, Divider, Grid, InputAdornment, List, ListItem, ListItemText, Step, StepLabel, Stepper, TextField, Tooltip, Typography } from '@mui/material';

const steps = [
	"Contracts signed",
	"Initial notice to proceed from the bank for funding",
	"In queue/in progress",
	"Interconnection management",
	"Procurement/equipment logistics",
	"Closeout",
	"Post install inspections",
	"Permission to operate from the utility"
];

const KPI = ({ project, refetch }) => {
	axios.defaults.withCredentials = true;

	async function moveProject(forward) {
		try {
			const { data } = await axios.patch(`http://localhost:4000/projects/${project._id}/move/${forward}`);
			refetch();
		} catch (e) {
			// TODO
			alert(e);
		}
	}
	async function moveProjectBackward() { await moveProject(false); }
	async function moveProjectForward() { await moveProject(true); }

	return (
		<Box sx={{ width: '100%' }}>
			<h3>Stage</h3>
			<Stepper activeStep={project.stage} alternativeLabel>
				{steps.map((label, index) => {
					return (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			<React.Fragment>
				<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
					<Tooltip title={`${steps[0]} → ${steps[0]}`} placement="right">
						<span>
							<Button
								color="inherit"
								disabled={project.stage === 0}
								onClick={moveProjectBackward}
								sx={{ mr: 1 }}
							>
								Back
							</Button>
						</span>
					</Tooltip>
					<Box sx={{ flex: '1 1 auto' }} />
					<Tooltip title={`${steps[0]} → ${steps[0]}`} placement="left">
						<span>
							<Button onClick={moveProjectForward} disabled={project.stage === steps.length}>
								{project.stage < steps.length - 1 ? 'Next' : 'Finish'}
							</Button>
						</span>
					</Tooltip>
				</Box>
			</React.Fragment>
		</Box>
	);
};

export default KPI;