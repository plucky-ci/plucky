import React from 'react';
import { Card, CardText, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

class DashboardContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			projects: []
		};

		this.props.socket.on('project:list', (projects) => {
			console.log(projects);
			this.setState({
				projects
			});
		});

		this.props.socket.emit('project:get');
	}

	build(project, version) {
		this.props.socket.emit('pipeline:start', project);
	}

	createProjectCards() {
		const projectList = [];
		this.state.projects.forEach((project) => {

			projectList.push(
				<div className="col-md-6" key={`${project.config.name}`}>
					<Card>
						<CardTitle title={project.config.name}/>
						<CardActions>
							<FlatButton 
								backgroundColor="green"
								style={{color: 'white'}}
								label="Build Patch"
								onClick={() => { this.build(project.config, 'p')}} />
							<FlatButton 
								backgroundColor="blue" 
								style={{color: 'white'}}
								label="Build Minor" 
								onClick={() => { this.build(project.config, 'm')}} />
							<FlatButton 
								backgroundColor="orange" 
								style={{color: 'white'}}
								label="Build Major" 
								onClick={() => { this.build(project.config, 'M')}} />
						</CardActions>
						<CardText>
							bring back health somewhere
						</CardText>
						<Divider />
						<CardText>
							bring back release list somehow
						</CardText>
					</Card>
				</div>
			);
		});

		return projectList;
	}

	render() {
		const projects = this.createProjectCards();
		return (
			<div className="row">
				{projects}
			</div>
		);
	}
}

export default DashboardContainer;