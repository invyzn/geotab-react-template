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
global.api
global.state = require('./state');
global.geotab = {
    addin: {}, 
    customButtons: {}, 
    isDriveAddin: false,
    isLocalHost: true
}
// Importing the app rules -> Where addin will be described

// Importing dev-specific packages
import './rison';
import './login/loginTemplate.js';
import GeotabLogin from './login/loginLogic';
import GeotabApi from './api';

// Building navbar
// Exposing handler to let the translate function have access to it
//import './navbar/NavBuilder';
import './styles/styleGuide.css';


/* Group Filter Module */
import GroupListeners from './groups/GroupListeners.js';
let groupListener = new GroupListeners(global.api, global.state, 'group-dropdown');
groupListener.assignEventListeners();

// Handling the blur toggle
require('./ToggleHandler');

let initilized = false;

initilized = setInterval(() => {
    if(Object.keys(geotab.addin).length > 0) {
        new GeotabLogin(global.geotab.isDriveAddin, GeotabApi);
        clearInterval(initilized);
    }
}, 50)

// Setting up mock display panel
// Setting up mock display panel
let mainPanel = document.querySelector('#geotabApp');
mainPanel.id = 'checkmateContent';
mainPanel.className = 'centerPane';
mainPanel.style.top = '40px';
mainPanel.style.left = '50px';

// Creating new div with the ID geotabApp
let newDiv = document.createElement('div');
newDiv.id = 'geotabApp';
mainPanel.appendChild(newDiv);
// Setup complete