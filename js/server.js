// The below code creates a simple HTTP server with the NodeJS `http` module,
// and makes it able to handle websockets. However, currently it does not
// actually have any websocket functionality - that part is your job!

var http = require('http');
var io = require('socket.io');
var qid = 0;

var requestListener = function (request, response) {
  response.writeHead(200);
  response.end('Hello, World!\n');
};

var server = http.createServer(requestListener);

server.listen(8080, function () {
  console.log('Server is running...');
});

var socketServer = io(server);

socketServer.on( 'connection', function(socket) {
	socket.emit('new_board',
		messages);

	socket.on('select_piece', function(data) {
		if (messages.hasOwnProperty(data)) {
			socket.emit('question_info', messages[data]);
		}else {
			socket.emit('question_info', null);
		}
	});

	socket.on('move', function(data) {
		messages[qid] = data;
		messages[qid]['answer'] = '';
		messages[qid]['author'] = socket.id;
		messages[qid]['id'] = qid;
		qid++;
		socketServer.emit('new_question_added', messages[qid-1]);
	});

	socket.on('capture', function(data) {
		messages[data.id]['answer'] = data.text;
		socket.broadcast.emit('answer_added', messages[data.id]);
	});

	socket.on('win', function(data) {
		messages[data.id]['answer'] = data.text;
		socket.broadcast.emit('answer_added', messages[data.id]);
	});

	socket.on('message', function(data) {
		messages[data.id]['answer'] = data.text;
		socket.broadcast.emit('answer_added', messages[data.id]);
	});


});



// This is the object that will keep track of all the current messages in the server.
// It can be considered to be the (in-memory) database of the application.
var messages = {};

// Your code goes here:

