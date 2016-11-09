const config = require('config');
const projectService = require('../services/projectService');

class ProjectController {
	constructor(options) {
		this.socket = options.socket;
		this.io = options.io;
		this.socket.on('project:get', this.getProjects.bind(this));
	}

	getProjects() {
		projectService.getProjects().then((projectList) => {
			console.log(projectList[0].config.pipelines.build.process[0].params);
			this.socket.emit('project:list', projectList);
		});
	}
}

module.exports = ProjectController;