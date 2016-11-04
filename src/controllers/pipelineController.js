const config = require('config');
const projectService = require('../services/projectService');
const {Pipeline} = require('plucky-pipeliner');
const {plugins} = require('plucky-plugin-manager');
const {jsonMapper} = require('plucky-mapper');

class ProjectController {
	constructor(options) {
		this.socket = options.socket;
		this.socket.on('build:start', this.executeBuild.bind(this));
		this.socket.on('pipeline:get', this.getProjectPipeline.bind(this));
	}

	executeBuild(project) {
		plugins.get(project.imports, (err, obj) => {
			// any web overrides will be done here
			const processOverrides = jsonMapper(project.build, config);
			const build = new Pipeline({
				name: project.name,
				description: project.description,
				tasks: obj,
				process: processOverrides.process
			});
			build.execute({}, (error, result) => {
				console.log('build completed');
				this.socket.emit('build:completed', {error, project});
			});
			build.on('progress', (progress) => {
				console.log('build progress');
				this.socket.emit('build:progress', progress);
			});
			build.on('steperror', (error) => {
				console.log('build steperror');
				this.socket.emit('build:steerror', error);
			});
		});
	}

	getProjectPipeline(project) {
		plugins.get(project.imports, (err, obj) => {
			const processOverrides = jsonMapper(project.pipeline, config);
			const pipeline = new Pipeline({
				tasks: obj,
				process: processOverrides.process
			});
			pipeline.execute({}, (error, val) => {
				console.log('pipelie list');
				this.socket.emit('pipeline:list', val.result);
			});
			

		});
		
	}
}

module.exports = ProjectController;