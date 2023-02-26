import React from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';

const Error = () => {
	const location = useLocation();

	return (
		<div>
            <h2>Error</h2>
			<p>{location && location.state && location.state.error ? location.state.error : 'Page not found!'}</p>
		</div>
	);
};

export default Error;
