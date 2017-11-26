//todo: mooie github maken
//multi video streaming
//firefox fixen

document.addEventListener('DOMContentLoaded', init, false);

async function enableAudio() {
    try {
        let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
        connection.reconfigureConnection({stream: stream});
    } catch (e) {
        alert(e.name + ', Make sure you have a microphone and that you have a connection');
        console.log(e);
    }
}

async function enableVideo() {
    try {
        let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        connection.reconfigureConnection({stream: stream});
    } catch (e) {
        alert(e.name + ', Make sure you have a microphone, camera and that you have a connection');
        console.log(e);
    }
}

function disableMedia() {
    connection.reconfigureConnection();
}

function init() {
    let roomPickerForm = document.querySelector('.room-picker');
    let video = document.querySelector('.video');
    let output = document.querySelector('.output');
    let connectionReady = false;
    // let connection;
    let username;

    roomPickerForm.addEventListener('submit', e => {
        e.preventDefault();
        let room = e.target.room.value;
        username = e.target.username.value;
        connection = new RTCConnection(room, "https://wake.ruurdbijlsma.com");
        // connection = new RTCConnection(room, "https://localhost:443");

        connection.on('signalServerConnect', () => {
            console.log("Connected to signal server");
            roomPickerForm.innerHTML=`<p>Connected to signalServer</p>`;
        });
        connection.on('signalServerDisconnect', () => {
            console.log("Disconnected from signal server");
            roomPickerForm.innerHTML+=`<p>Disconnected from signalServer</p>`;
        });
        connection.on('peerConnect', () => {
            console.log("Connected to peer");
            roomPickerForm.innerHTML+=`<p>Connected to peer</p>`;
            connectionReady = true;
        });
        connection.on('peerDisconnect', () => {
            console.log("Disconnected from peer");
            roomPickerForm.innerHTML+=`<p>Disconnected from peer</p>`;
        });
        connection.on('message', data => {
            let {sender, message} = JSON.parse(data);
            output.innerHTML += `<p>${sender}:${message}</p>`;
            console.log(`Received message ${sender}:${message}`);
        });
        connection.on('stream', stream => {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        });
    });

    let messageForm = document.querySelector('.message-sender');
    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        let message = e.target.message.value;
        if (connectionReady) {
            output.innerHTML += `<p>me:${message}</p>`;
            connection.broadcast('message', JSON.stringify({sender: username, message: message}));
            e.target.message.value = '';
        } else {
            alert("Connection is not yet ready")
        }
    });
}