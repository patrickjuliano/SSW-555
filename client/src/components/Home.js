import React from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';

const Home = ({ user, reset }) => {
	reset();

	return (
		<div>
            <h2>Home</h2>
			{user ?
				<div>
					<p>Welcome back to Solar EPC Hub, {user.firstName}! The goal of this application is to bridge the gap between clients and the different departments contributing to development in the context of solar projects.</p>
					<p>Create or join a project to get started, or select an existing project from the sidebar to pick up where you left off.</p>
				</div>
			:
				<div>
					<p>Welcome to Solar EPC Hub! The goal of this application is to bridge the gap between clients and the different departments contributing to development in the context of solar projects.</p>
					<p>To get started, sign up or log in using the options presented in the sidebar.</p>
				</div>
			}
		</div>
	);
};

export default Home;
