/**
 * Entry point for serving the app on localhost
 * Allows several UI features to be displayed to improve
 * development without adding them in to the final
 * build sent to production
 * 
 * ******************** NOTE ********************
 * 
 *  Any features built into this file will not be included in
 * the addin build. Any changes you want included should be in
 * app/index.js instead.
 * 
 * **********************************************
 */

// Global object is used to simulate the api, state, and geotab objects
import "./styles/form.scss";
import "./styles/mapAddinStyles.css";

global.events = require('./events');
global.api
global.state = require('./state');
global.geotab = {
    addin: {}, 
    customButtons: {}, 
    isDriveAddin: false
}
// Importing the app rules -> Where addin will be described

require('./addin');

// Importing dev-specific packages
//import './rison';
import './login/loginTemplate.js';
import GeotabLogin from './login/loginLogic';
import GeotabApi from './api';

let initilized = false;

initilized = setInterval(() => {
    if(Object.keys(geotab.addin).length > 0) {
        new GeotabLogin(global.geotab.isDriveAddin, GeotabApi);
        clearInterval(initilized);
    }
}, 50)


// Handling the blur toggle
// require('./ToggleHandler');
// Setup complete
