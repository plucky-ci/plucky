const config = require('config');
const projectService = require('../services/projectService');
const {Pipeline} = require('plucky-pipeliner');
const {plugins} = require('plucky-plugin-manager');

class ProjectController {
	constructor(options) {
		this.socket = options.socket;
		this.socket.on('pipeline:start', (project) => {
			// const pipeline = new Pipeline({
			// 	name: project.name,
			// 	description: project.description,
			// 	tasks: plugins.get(project.imports),
			// 	process: project.process
			// });
			plugins.get(project.imports, (err, obj) => {
				console.log(obj);
			});
		});
	}

	executePipeline(project) {
		
	}
}

module.exports = ProjectController;