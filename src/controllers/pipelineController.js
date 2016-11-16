const config = require('config');
const projectService = require('../services/projectService');
const {Pipeline} = require('plucky-pipeliner');
const {plugins} = require('plucky-plugin-manager');
const {jsonMapper} = require('plucky-mapper');

class ProjectController {
	constructor(options) {
		this.socket = options.socket;
		this.io = options.io;
		this.socket.on('pipeline:start', this.executePipeline.bind(this));
	}

	executePipeline(params) {
		const {
			imports,
			module,
			projectName,
			overrides,
			pipelineName
		} = params;
		plugins.get(imports, (err, obj) => {
			// any web overrides will be done here
			const processOverrides = jsonMapper(module, overrides);
			const pipeline = new Pipeline({
				name: projectName,
				tasks: obj,
				process: processOverrides.process
			});
			pipeline.execute({}, (error, result) => {
				console.log('pipeline completed');
				this.io.emit('pipeline:completed', {params});
			});
			pipeline.on('progress', (progress) => {
				console.log('pipeline progress', progress);
				this.io.emit('pipeline:progress', {params, progress});
			});
			pipeline.on('steperror', (error) => {
				console.log('pipeline steperror');
				this.io.emit('pipeline:steperror', {params, error});
			});
		});
	}
}

module.exports = ProjectController;