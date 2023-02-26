import React from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';

const Home = ({ user }) => {
	return (
		<div>
            <h2>Home</h2>
			{user ?
				<p>Welcome back, {user.firstName}! Create or join a project to get started, or select an existing project from the sidebar to pick up where you left off.</p>
			:
				<p>Welcome! To get started, sign up or log in using the options presented in the sidebar.</p>
			}
		</div>
	);
};

export default Home;
