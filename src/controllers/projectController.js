
const config = require('config');
const projectService = require('../services/projectService');

class ProjectController {
	constructor(options) {
		this.socket = options.socket;
		this.getProjects();
		this.socket.on('project:get', this.getProjects);
	}

	getProjects() {
		projectService.getProjects().then((projectList) => {
			this.socket.emit('project:list', projectList);
		});
	}
}

module.exports = ProjectController;