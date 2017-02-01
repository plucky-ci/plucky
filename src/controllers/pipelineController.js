const config = require('config');
const projectService = require('../services/projectService');
const {Pipeline} = require('plucky-pipeliner');
const {plugins} = require('plucky-plugin-manager');
const {jsonMapper} = require('plucky-mapper');
const jsonfile = require('jsonfile');
const historyService = require('../services/historyService');
const uuid = require('uuid');

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
			pipelineName,
			meta
		} = params;
		const id = uuid.v4();
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

				historyService.completeHistory(id, result, false, true).then((historyList) => {
					this.io.emit('pipeline:completed', {params, result, historyList});
				});

			});
			pipeline.on('progress', (progress) => {
				console.log('pipeline progress', progress);

				historyService.updateHistoryProgress(id, progress, true, false).then((historyList) => {
					this.io.emit('pipeline:progress', {params, progress, historyList});
				});

			});
			pipeline.on('steperror', (error) => {
				console.log('pipeline steperror');

				historyService.historyError(id, error, false, false).then((historyList) => {
					this.io.emit('pipeline:steperror', {params, error, historyList});
				});
			});

			historyService.createHistory(id, projectName, pipelineName, overrides, meta).then((historyList) => {
				this.io.emit('pipeline:history', historyList);
			});
		});
	}
}

module.exports = ProjectController;