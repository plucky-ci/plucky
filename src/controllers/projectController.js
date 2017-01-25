const config = require('config');
const projectService = require('../services/projectService');
const historyService = require('../services/historyService');
const BitesizeConfiguration = require('plucky-common');
const GitWrap = require('plucky-git').GitWrap;

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
				const localConfig = projectConfig.localConfig;
				promiseList.push(this.pullLatestBitesize(localConfig.bitesizeFolder, localConfig.bitesizeRepository).then(() => {
					const biteSize = new BitesizeConfiguration(`${localConfig.bitesizeFolder}/environments.bitesize`);
					const releaseObj = this.createReleaseObject(biteSize.getOrderedEnvironments(), localConfig.envAddons);
					projectConfig.modules.release = releaseObj;
					return historyService.getHistory(projectConfig.name);
				}).then((projectHistory) => {
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

	createReleaseObject(orderedList, envAddons) {
		const environmentObj = {};
		orderedList.forEach((env) => {
			let environment = env;
			if(envAddons[env.name]) {
				environment = Object.assign(env, envAddons[env.name]);
			}
			environmentObj[env.name] = environment;
		});

		return environmentObj;
	}

	pullLatestBitesize(directory, repository) {
		const gitWrap = new GitWrap(directory, repository);
		return gitWrap.clone();
	}
}

module.exports = ProjectController;