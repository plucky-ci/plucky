console.log('hello world');

let socket = io('http://localhost:3000');

socket.on('project:list', (result) => {
	console.log(result);
});