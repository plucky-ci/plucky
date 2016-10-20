const config = require('config');
const projectService = require('../services/projectService');
const {Pipeline} = require('plucky-pipeliner');
const {plugins} = require('plucky-plugin-manager');

class ProjectController {
	constructor(options) {
		this.socket = options.socket;
		this.socket.on('pipeline:start', this.executePipeline.bind(this));
	}

	executePipeline(project) {
		plugins.get(project.imports, (err, obj) => {
			const pipeline = new Pipeline({
				name: project.name,
				description: project.description,
				tasks: obj,
				process: project.process
			});
			pipeline.execute({}, (error, result) => {
				this.socket.emit('pipeline:completed', {error, project});
			});
		});
	}
}

module.exports = ProjectController;