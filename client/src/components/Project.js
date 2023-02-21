import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import '../App.css';

import Tasks from '../components/Tasks';
import Photos from '../components/Photos';
import Communications from '../components/Communications';
import KPI from '../components/KPI';
import Error from '../components/Error';

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

const Project = () => {
	const [tab, setTab] = useState(0);

	const changeTab = (event, value) => {
		setTab(value);
	}

	return (
		<div>
            <h2>Project Title</h2>
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
	);
};

export default Project;
