import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import './indexstyles.scss';
// not sure why i need to do this but there is a warning about it
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(
	<MuiThemeProvider>
		<div>
			<AppBar
				className="appBar"
				title="Plucky" 
				style={{ backgroundColor: 'green' }} />
			<div className="container-fluid app-body" style={{ paddingTop:'20px' }}>
			</div>
		</div>
	</MuiThemeProvider>
, document.getElementById('entry'));