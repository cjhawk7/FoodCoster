const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const router = express.Router();
const app = express();
app.use(express.static('public'));




const jsonParser = bodyParser.json();
app.use(morgan('common'));

app.get('/makeRequest', function (req, res) {
 
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  next();
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


  let server;

  function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
      // mongoose.connect(makeRequest, err => {
      //   if (err) {
      //     return reject(err);
      //   }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        // need to pass in server?
        resolve(server);
      }).on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
}

//config for mongoose, check sample code
  function closeServer() {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
          // so we don't also call `resolve()`
          return;
        }
        resolve();
      });
    });
  }

  if (require.main === module) {
    runServer().catch(err => console.error(err));
  };
  
  module.exports = {app, runServer, closeServer};


