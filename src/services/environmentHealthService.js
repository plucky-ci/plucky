const requestET = require('./requestET');


module.exports = {
	getEnvironmentHealth: function(url) {
		return new Promise((resolve, reject) => {
			requestET({
		        url,
		        method: 'GET'
		    }, (err, payload) => {
		    	console.log('payload', payload);
		    	console.log(err);
		    	if(err && err.output && err.output.statusCode) {
		    		return resolve({
		    			state: 'error',
		    			detail: err.output.statusCode
		    		});
		    	}
		    	if(err && !err.output) {
		    		return resolve({
		    			state: 'error',
		    			detail: '500'
		    		});
		    	}

		    	resolve({
		    		state: 'ok',
		    		detail:payload
		    	});
		    });
		});
		
	}
}