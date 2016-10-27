const config = require('config');
const projectService = require('../services/projectService');
const {Pipeline} = require('plucky-pipeliner');
const {plugins} = require('plucky-plugin-manager');
const {jsonMapper} = require('plucky-mapper');


class ProjectController {
	constructor(options) {
		this.socket = options.socket;
		this.socket.on('pipeline:start', this.executePipeline.bind(this));
	}

	executePipeline(project) {
		plugins.get(project.imports, (err, obj) => {
			// any web overrides will be done here
			const processOverrides = jsonMapper(project, {});
			const pipeline = new Pipeline({
				name: project.name,
				description: project.description,
				tasks: obj,
				process: processOverrides.process
			});
			pipeline.execute({}, (error, result) => {
				console.log(result);
				this.socket.emit('pipeline:completed', {error, project});
			});
			pipeline.on('progress', (progress) => {
				console.log(progress);
				this.socket.emit('pipeline:progress', progress);
			});
		});
	}
}

module.exports = ProjectController;