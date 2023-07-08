import React, { useEffect, useState } from 'react';
import { useGeotabContext } from '../providers/Geotab';

import Header from '../components/Header';
import TitleFool from './TitleFool';

import { render } from '../utils';

function MySecond() {
	const [name, setName] = useState();
	const { api } = useGeotabContext();

	useEffect(() => {
		api.getSession(session => {		
			api.call("Get", {
				"typeName": "user",
				"search": {
					"name": session.userName
				}
			}, ([user]) => {
				setName(`${user.firstName} ${user.lastName}`);	
			})
		})
	}, [])

	return (<>
		<Header />
		<div>
			{name ? <>
				<TitleFool name={name} />
				<p style={{"color": "red"}}>You came to the second page.</p>
			</> : <>
				<h3>MyGeotab API "Reference"</h3>
				<p style={{"color": "red"}}>Giving your CPU something to do...</p>
			</>}
			
		</div>
	</>);
}

render(MySecond);
