import React from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';

const Error = (reset) => {
	const location = useLocation();
	reset();

	return (
		<div>
            <h2>Error</h2>
			<p>{location && location.state && location.state.error ? location.state.error : 'Page not found!'}</p>
		</div>
	);
};

export default Error;
