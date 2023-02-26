import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';

import Tasks from '../components/Tasks';
import Photos from '../components/Photos';
import Communications from '../components/Communications';
import KPI from '../components/KPI';
import Error from '../components/Error';
import { useNavigate, useParams } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 1, pb: 1, pl: 3, pr: 3 }}>
          {
		  	children == 'Tasks' ? <Tasks /> :
			children == 'Photos' ? <Photos /> :
			children == 'Communications' ? <Communications /> :
			children == 'KPI' ? <KPI /> :
			'Not found'
		  }
        </Box>
      )}
    </div>
  );
}

const Project = ({ user }) => {
  	axios.defaults.withCredentials = true;
	let { id } = useParams();
	const navigate = useNavigate();
	const [tab, setTab] = useState(0);
	const [project, setProject] = useState(null);
	const [owner, setOwner] = useState(null);

	useEffect(
		() => {
			async function fetchData() {
				let hasPermission = false;
				if (user) {
					for (const project of user.projects) {
						if (project._id === id) {
							hasPermission = true;
							break;
						}
					}
				}
				if (!hasPermission) navigate('/error', { state: { error: 'You do not have permission to view this page.' } });

				try {
					var { data } = await axios.get(`http://localhost:4000/projects/${id}`);
					const projectData = data;
					setProject(projectData);
					var { data } = await axios.get(`http://localhost:4000/users/${projectData.owner}`);
					const ownerData = data;
					setOwner(ownerData);
				} catch (e) {
					navigate('/error');
				}
			}
			fetchData();
		},
		[ id ]
	);

	const changeTab = (event, value) => {
		setTab(value);
	}

	return (
		<div>
			{project && owner &&
				<div>
					<h2>{project.title}</h2>
					<p>Owner: {owner.firstName} {owner.lastName} ({owner.email})</p>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs value={tab} onChange={changeTab} aria-label='Project tabs'>
							<Tab label='Tasks' />
							<Tab label='Photos' />
							<Tab label='Communications' />
							<Tab label='KPI' />
						</Tabs>
					</Box>
					<TabPanel value={tab} index={0}>Tasks</TabPanel>
					<TabPanel value={tab} index={1}>Photos</TabPanel>
					<TabPanel value={tab} index={2}>Communications</TabPanel>
					<TabPanel value={tab} index={3}>KPI</TabPanel>
				</div>
			}
		</div>
	);
};

export default Project;
