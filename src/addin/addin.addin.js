import React from 'react';
import ReactDOM from 'react-dom';

import Header from '../components/Header';
import TitleFool from './TitleFool';
import c from './MySecond.scss';

import { render } from '../utils';

function MySecond() {
	const url = new URL(window.location);
	const name = url.searchParams.get('name');

	return (<>
		<Header />
		<div className={c.body}>
			<TitleFool name={name} />
			<p className={c.red}>You came to the second.</p>
			<p><a href="../index.html">Go to Index</a></p>
		</div>
	</>);
}

render(MySecond);
