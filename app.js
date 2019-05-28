const http = require('http');
const fs = require('fs');
const ent = require('ent');

const server = http.createServer(function (req, res) {
    fs.readFile('./index.html', 'utf-8', function (error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo){
    socket.on('new', function(pseudo){
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new', pseudo);
    });
    socket.on('message', function (message){
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });

});

server.listen(8080);