const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ProjectController = require('./src/controllers/projectController');
const PipelineController = require('./src/controllers/pipelineController');
const HealthController = require('./src/controllers/healthController');
app.use(express.static('web'));

app.use('/health', HealthController);

io.on('connection', function(socket){
  	const projectController = new ProjectController({socket});
  	const pipelineController = new PipelineController({socket, io});
});

http.listen(3000, function(){
  console.log('listening on 3000');
});