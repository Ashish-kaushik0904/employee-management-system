// Backend ***********************************************

1. Server.js => 
This is the main entry file of your Node.js + Express backend (server.js or index.js). It is responsible for:-
Importing required packages.
Connecting to MongoDB.
Configuring middleware.
Registering routes.
Starting the server.

2. What is CORS?
CORS (Cross-Origin Resource Sharing) is a browser security mechanism that allows a server to specify which external websites (origins) are allowed to access its resources.
It is not a Node.js feature. It is implemented by web browsers and controlled by HTTP headers sent by the server
Same-Origin Policy prevents one website from accessing data from another website unless permission is granted.

Example:

Frontend:
http://localhost:3000

Backend:
http://localhost:5000

Since the ports are different, these are different origins.

The browser blocks the request unless the backend explicitly allows it.

-> Same Origin:- 
Frontend:
http://localhost:3000

Backend:
http://localhost:3000

-> Cross Origin:- 
Frontend:
http://localhost:3000

Backend:
http://localhost:5000

-> How CORS Works
1. Browser sends request.
2. Server checks the Origin header.
3. Browser verifies the response.

-> This allows all origins by default.

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

-> Allow Only One Origin
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
CORS — Cross Origin Resource Sharing. Frontend (5173) aur Backend (5000) alag ports pe hain. Browser by default alag port ki request block karta hai. Yeh middleware allow karta hai. credentials: true — cookies bhi allow karo.

