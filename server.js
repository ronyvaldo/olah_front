//Install express server
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const olah_dir = __dirname+"/dist/olah-app";

// Serve only the static files form the dist directory
app.use(express.static(olah_dir));

console.log("==================");

const local = __dirname+"/src";
const dist = __dirname+"/dist";

fs.readdir(__dirname, (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
  });

  fs.readdir(local, (err, files) => {
    files.forEach(file => {
      console.log("local: "+file);
    });
  });

  fs.readdir(dist, (err, files) => {
    files.forEach(file => {
      console.log("dist: "+file);
    });
  });

  fs.readdir(olah_dir, (err, files) => {
    files.forEach(file => {
      console.log("olah_dir: "+file);
    });
  });


  console.log("==================");

app.get('/', (req, res) =>
    res.sendFile(path.join(local, '/index.html'))
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 4200);