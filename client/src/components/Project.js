import { Box, Button, IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';

import Tasks from '../components/Tasks';
import Photos from '../components/Photos';
import Communications from '../components/Communications';
import KPI from '../components/KPI';
import Error from '../components/Error';
import { useNavigate, useParams } from 'react-router-dom';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Subprojects from './Subprojects';

function TabPanel(props) {
  const { children, value, index, project, refetch, ...other } = props;

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
		  	children == 'Tasks' ? <Tasks project={project} refetch={refetch} /> :
			children == 'Photos' ? <Photos project={project} refetch={refetch} /> :
			children == 'Communications' ? <Communications project={project} refetch={refetch} /> :
			children == 'KPI' ? <KPI project={project} refetch={refetch} /> :
			'Not found'
		  }
        </Box>
      )}
    </div>
  );
}

const Project = ({ user, projects, reset }) => {
  	axios.defaults.withCredentials = true;
	let { id } = useParams();
	const navigate = useNavigate();
	const [tab, setTab] = useState(0);
	const [project, setProject] = useState(null);
	const [owner, setOwner] = useState(null);
	const [subprojectsOpen, setSubprojectsOpen] = useState(false);
	const [fetchFlag, setFetchFlag] = useState(false);

	useEffect(() => {
		async function fetchData() {
			try {
				var { data } = await axios.get(`http://localhost:4000/projects/${id}`);
				const projectData = data;
				setProject(projectData);
				reset(projectData._id);
				var { data } = await axios.get(`http://localhost:4000/users/${projectData.owner}`);
				const ownerData = data;
				setOwner(ownerData);
			} catch (e) {
				navigate('/error');
			}
			try {
				let hasPermission = false;
				if (user && projects) {
					for (const project of projects) {
						if (project._id === id) {
							hasPermission = true;
							break;
						}
					}
				}
				if (!hasPermission) throw 'You do not have permission to view this page.';
			} catch (e) {
				navigate('/error', { state: { error: e } });
			}
		}
		fetchData()
	}, [ id, user, projects ]);

	useEffect(
		() => {
			if (fetchFlag) {
				async function fetchData() {
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
					try {
						let hasPermission = false;
						if (user && projects) {
							for (const project of projects) {
								if (project._id === id) {
									hasPermission = true;
									break;
								}
							}
						}
						if (!hasPermission) throw 'You do not have permission to view this page.';
					} catch (e) {
						navigate('/error', { state: { error: e } });
					}
					setFetchFlag(false);
				}
				fetchData()
			}
		},
		[ fetchFlag ]
	)

	const changeTab = (event, value) => {
		setTab(value);
	}

	return (
		<div>
			{project && owner &&
				<div>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						{project && project.parent &&
							<Tooltip title={`Navigate to ${project.parent.title}`} style={{ marginRight: 10 }}>
								<IconButton onClick={() => navigate(`/projects/${project.parent._id}`)} sx={{ color: 'black' }}>
									<KeyboardReturnIcon />
								</IconButton>
							</Tooltip>
						}
						<h2 style={{ marginRight: 10 }}>{project.title}</h2>
						<Tooltip title='Copy Project ID'>
							<IconButton onClick={() => {navigator.clipboard.writeText(project._id)}} sx={{ color: 'black' }}>
								<ContentCopyIcon />
							</IconButton>
						</Tooltip>
						{project && project.subprojects && project.subprojects.length > 0 &&
							<Tooltip title='View Subprojects'>
								<IconButton onClick={() => setSubprojectsOpen(true)} sx={{ color: 'black' }}>
									<AccountTreeIcon />
								</IconButton>
							</Tooltip>
						}
					</div>
					
					<p>Owner: {owner.firstName} {owner.lastName} ({owner.email})</p>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs value={tab} onChange={changeTab} aria-label='Project tabs'>
							<Tab label='Tasks' />
							<Tab label='Photos' />
							<Tab label='Communications' />
							<Tab label='KPI' />
						</Tabs>
					</Box>
					<TabPanel value={tab} index={0} project={project} refetch={() => setFetchFlag(true)}>Tasks</TabPanel>
					<TabPanel value={tab} index={1} project={project} refetch={() => setFetchFlag(true)}>Photos</TabPanel>
					<TabPanel value={tab} index={2} project={project} refetch={() => setFetchFlag(true)}>Communications</TabPanel>
					<TabPanel value={tab} index={3} project={project} refetch={() => setFetchFlag(true)}>KPI</TabPanel>

					<Subprojects
						subprojects={project.subprojects}
						whitelist={user.projects}
						open={subprojectsOpen}
						onClose={() => setSubprojectsOpen(false)}
						refetch={() => setFetchFlag(true)}
					/>
				</div>
			}
		</div>
	);
};

export default Project;
