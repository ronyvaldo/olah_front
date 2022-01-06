//Install express server
const express = require('express');
const path = require('path');

const app = express();

console.log("==========================");
console.log("Server.js OK");
console.log(__dirname);
console.log("==========================");

// Serve only the static files form the dist directory
app.use(express.static(__dirname));

app.get('/*', (req, res) =>
    res.sendFile(path.join('./src/index.html')),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 4200);