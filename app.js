const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ProjectController = require('./src/controllers/projectController');
const PipelineController = require('./src/controllers/pipelineController');

app.use(express.static('web'));


io.on('connection', function(socket){
  	const projectController = new ProjectController({socket});
  	const pipelineController = new PipelineController({socket});
});

http.listen(3000, function(){
  console.log('listening on 3000');
});