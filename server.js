//Install express server
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const olah_dir = __dirname+"/dist/olah-app";
const local = __dirname+"/src";

app.use(express.static(local));

app.get('/', (req, res) =>
    res.sendFile(path.join(local, '/index.html'))
);

app.listen(process.env.PORT || 4200);


/*console.log("==================");

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


  console.log("==================");*/