import React from 'react';
import PropTypes from 'prop-types';

function TitleFoo({name}) {
	return (
		<h1>{name}, fool!</h1>
	);
}

TitleFoo.propTypes = {
	name: PropTypes.string.isRequired
};

export default TitleFoo;
