const config = require('config');
const glob = require('glob');
const {ConfigLoader} = require('plucky-loader');

module.exports = {
	getProjects: () => {
		const baseUrl = config.projectsDirectory;
		const projects = [];
		return new Promise((resolve, reject) => {
			glob(`${baseUrl}/projects/*.?(js|json|yaml)`, {}, function(err, files) {
				if(err) {
					return reject(err);
				}

				files.forEach((file) => {
					const project = new ConfigLoader(file, config, {});
					projects.push(project.config);
				});
				resolve(projects);
			});
		});
	}
};