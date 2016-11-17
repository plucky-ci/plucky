const config = require('config');
const projectService = require('../services/projectService');
const historyService = require('../services/historyService');

class ProjectController {
	constructor(options) {
		this.socket = options.socket;
		this.socket.on('project:get', this.getProjects.bind(this));
	}

	getProjects() {
		projectService.getProjects().then((projectList) => {
			const responseList = [];
			const promiseList = [];

			projectList.forEach((projectConfig) => {
				promiseList.push(historyService.getHistory(projectConfig.name).then((projectHistory) => {
					responseList.push({
						projectConfig,
						projectHistory
					});
				}));
			});

			Promise.all(promiseList).then(() => {
				this.socket.emit('project:list', responseList);
			});
		});
	}
}

module.exports = ProjectController;