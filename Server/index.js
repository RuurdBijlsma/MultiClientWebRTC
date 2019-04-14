var app = require('express')();
var https        = require('https');
var server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/rtc.ruurd.dev/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/rtc.ruurd.dev/fullchain.pem'),
    requestCert: false,
    rejectUnauthorized: false
},app);
server.listen(5500);

var io = require('socket.io').listen(server);

io.sockets.on('connection',function (socket) {
    console.log(socket);
});

app.get("/", function(request, response){
    reseponse.send("DOEI");
})