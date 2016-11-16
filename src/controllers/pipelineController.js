const config = require('config');
const projectService = require('../services/projectService');
const {Pipeline} = require('plucky-pipeliner');
const {plugins} = require('plucky-plugin-manager');
const {jsonMapper} = require('plucky-mapper');
const jsonfile = require('jsonfile');
const uuid = require('uuid');
const path = require('path');

class ProjectController {
	constructor(options) {
		this.socket = options.socket;
		this.io = options.io;
		this.socket.on('pipeline:start', this.executePipeline.bind(this));
	}

	createHistory(project, pipeline, overrides, id) {
		const file = path.join(process.cwd(), config.history.file);
		let list = jsonfile.readFileSync(file, {throws: false});
		list.push({
			project,
			pipeline,
			overrides,
			step: [], 
			id,
			processing: true,
			succeeded: false
		});
		jsonfile.writeFileSync(file, list);
	}

	updateHistory(id, step, processing, succeeded) {
		const file = path.join(process.cwd(), config.history.file);
		let list = jsonfile.readFileSync(file, {throws: false});
		list.forEach((history) => {
			if(history.id === id) {
				history.step.push(step);
				history.processing = processing;
				history.succeeded = succeeded;
			}
		});
		jsonfile.writeFileSync(file, list);
	}

	executePipeline(params) {
		const {
			imports,
			module,
			projectName,
			overrides,
			pipelineName
		} = params;
		const randomId = uuid.v4();
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
				this.updateHistory(randomId, result, false, true);
				this.io.emit('pipeline:completed', {params, result});
			});
			pipeline.on('progress', (progress) => {
				console.log('pipeline progress', progress);
				this.updateHistory(randomId, progress, true, false);
				this.io.emit('pipeline:progress', {params, progress});
			});
			pipeline.on('steperror', (error) => {
				console.log('pipeline steperror');
				this.updateHistory(randomId, error, false, false);
				this.io.emit('pipeline:steperror', {params, error});
			});

			if(pipelineName === 'build' || pipelineName === 'release') {
				this.createHistory(projectName, pipelineName, overrides, randomId);
			}
		});
	}
}

module.exports = ProjectController;