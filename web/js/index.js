import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import './indexstyles.scss';
import DashboardContainer from './dashboard/dashboardContainer';
// not sure why i need to do this but there is a warning about it
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const socket = io('http://localhost:3000');

ReactDOM.render(
	<MuiThemeProvider>
		<div>
			<AppBar
				className="appBar"
				title="Plucky" 
				style={{ backgroundColor: 'green' }} />
			<div className="container-fluid app-body" style={{ paddingTop:'20px' }}>
				<DashboardContainer socket={socket} />
			</div>
		</div>
	</MuiThemeProvider>
, document.getElementById('entry'));

