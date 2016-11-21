'use strict';

const express = require('express'),
	router = express.Router(),
	environmentHealthService = require('../services/environmentHealthService');


router.get('/', function(req, res) {
	console.log(req.query);

	environmentHealthService.getEnvironmentHealth(req.query.url).then((result) => {
		res.status(200).send(result);
	}).catch((error) => {
		res.status(400).send(error);
	});

});

module.exports = router;
