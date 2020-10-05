var express = require('express');
var app = express();
var portNumber = 2000;

var fs = require('fs');

var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket)=>{
    console.log('A user connected');

    socket.on('disconnect', ()=>{
        console.log('A user disconnected');
    });

    socket.on('ChatMessage', (msg) =>{
        socket.broadcast.emit('chatText', {bool: false, message: msg});
        socket.emit('chatText', {bool: true, message: msg});
    });
    

    // Trying to serve the image
    fs.readFile(__dirname + '/profile.png', (err, buf)=>{
        socket.emit('profile', {image: true, buffer: buf.toString('base64')});
    });
});

http.listen(portNumber, ()=>{
    console.log(`Listening on *:${portNumber}`);
});