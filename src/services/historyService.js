const config = require('config');
const glob = require('glob');
const {ConfigLoader} = require('plucky-loader');
const path = require('path');
const jsonfile = require('jsonfile');


function updateHistory(id, step, processing, succeeded) {
	return new Promise((resolve, reject) => {
		const file = path.join(process.cwd(), config.history.file);
		let list = jsonfile.readFileSync(file, {throws: false});
		let listChanged = false;
		list.forEach((history) => {
			if(history.id === id) {
				history.step.push(step);
				history.processing = processing;
				history.succeeded = succeeded;
				listChanged = true;
			}
		});
		if(listChanged) {
			jsonfile.writeFileSync(file, list);
		}

		resolve(list);
	});
}

module.exports = {
	getHistory: (projectName) => {
		return new Promise((resolve, reject) => {
			const file = path.join(process.cwd(), config.history.file);
			const list = jsonfile.readFileSync(file, {throws: false});
			const projectHistoryList = list.filter((history) => {
				return history.project === projectName;
			});
			resolve(projectHistoryList);
		});
		
	},
	createHistory: (id, project, pipeline, overrides, meta) => {
		return new Promise((resolve, reject) => {
			const file = path.join(process.cwd(), config.history.file);
			let list = jsonfile.readFileSync(file, {throws: false});
			
			//imageList pipeline don't bother doing writing to the history
			if(pipeline === 'imageList') {
				return resolve(list);
			}

			list.push({
				project,
				pipeline,
				overrides,
				step: [], 
				id,
				meta,
				processing: true,
				succeeded: false
			});

			jsonfile.writeFileSync(file, list);

			resolve(list);
		});
	},
	updateHistoryProgress: (id, step, processing, succeeded) => {
		return updateHistory(id, step, processing, succeeded);
	},
	completeHistory: (id, step, processing, succeeded) => {
		return updateHistory(id, step, processing, succeeded);
	},
	historyError: (id, step, processing, succeeded) => {
		return updateHistory(id, step, processing, succeeded);
	}
};