# MultiClientWebRTC
Abstraction around WebRTC to make having a connection between more than 2 users easier.

This repository contains a demo client and the required server. 

## Demo client setup
### Set up the server
Linux requires `sudo` for running the server
```
npm update
node index.js
```
### Set up the demo client
1. Edit script.js, change the connection url to your server ip
2. Run your client html on localhost
3. Visit localhost in your browser
4. It be needed to add the self signed certificate to your trusted certs by visiting your server ip in the browser
5. Click join room to join the default room
6. Click join room on another tab/window
7. The two or more windows should now be connected with WebRTC
