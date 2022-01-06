//Install express server
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve only the static files form the dist directory
//app.use(express.static(__dirname));

console.log("==================");

fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
  });

  console.log("==================");

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/index.html'))
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 4200);