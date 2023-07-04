import React from 'react';
import { render } from './utils'; 
import Header from './components/Header';

render(() => {
	return (<>
		<Header />
		<h1>This is main index.</h1>
		<p><a href="my-second.html?name=You">Go to Second</a></p>
	</>);
})