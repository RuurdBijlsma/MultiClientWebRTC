var https = require('https'),
    fs = require('fs'),
    maxClients = 4,
    options = {
        // Real cert
        key: fs.readFileSync('/etc/letsencrypt/live/rtc.ruurdbijlsma.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/rtc.ruurdbijlsma.com/fullchain.pem'),
        // Development cert
        // key: fs.readFileSync('../Certificate/key.pem'),
        // cert: fs.readFileSync('../Certificate/cert.pem'),
    },
    server = https.createServer(options),
    port = 443,
    io = require('socket.io')(server);

server.listen(port);
console.log('Now listening on ' + port);


io.on('connection', socket => {
    var ip = socket.request.connection.remoteAddress.split(':').splice(-1)[0];
    console.log("Client connected with ip:", ip);

    socket.emit('socketId', socket.id);

    socket.on('disconnect', () => {
        console.log("Client disconnected");
    });

    socket.on('signal', (signal, peerId, success) => {
        console.log(`Received signal event, sending to peer with id: ${peerId}`);
        io.sockets.connected[peerId].emit('signal', signal, socket.id);
        success(true, `sent signal to ${peerId}`);
    });

    socket.on('createOrJoin', (room, success) => {
        console.log("Received request to create or join room", room);
        var numClients = getRoomClientCount(room);

        if (numClients === 0) {
            socket.join(room);
            success(true, 'created');
            // console.log(socket.id + " created room " + room);
        } else if (numClients < maxClients) {
            socket.join(room);
            socket.broadcast.to(room).emit('join', socket.id);
            success(true, 'joined');
        } else {
            success(false, 'full');
        }

        console.log(`Total clients in room ${room} now ${getRoomClientCount(room)}`);
    });
});

function getRoomClientCount(room) {
    var clientsInRoom = io.sockets.adapter.rooms[room];
    return clientsInRoom === undefined ? 0 : clientsInRoom.length;
}