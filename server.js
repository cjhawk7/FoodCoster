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
const {PORT, DATABASE_URL} = require('./config');
const {userList} = require('./models');
const {seedUserListData} = require('./test/test');
// const router = require('./router');
// app.use('/router', router);


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  next();
});
// see mongoose docs, needs to return promise

// let mockSearch = {
//   budget: 500,
//   location: 'Denver',
//   time: 1
// }

// userList.create(mockSearch, function(err) {
//   if (err)
// });


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/makeRequest/:cityName', function (req, res) {
  var instance = axios.create();
  // console.log(req.params, 'params') 
  instance.get(`https://www.numbeo.com/api/city_prices?api_key=4uxocu7eiqwid6&query=${req.params.cityName}&currency=USD`, {
    headers: {'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE'
    }
  })
  .then(function (response) {
    const data = {
      data: response.data.prices[0],
      currency: response.data.currency
    }
    console.log(data)
    res.json(data);
  })
  .catch(function (error) {
    
  });
});

app.get('/userList/:id', (req, res) => {
  searchSchema
    .findById(req.params.id)
    .then(searchSchema => res.json(searchSchema.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

app.post('/userList', (req, res) => {

  const requiredFields = ['budget', 'location', 'time'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  searchSchema
    .create({
      budget: req.body.budget,
      location: req.body.location,
      time: req.body.time,
    })
    .then(
      searchSchema => res.status(201).json(searchSchema.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      seedUserListData();
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        console.log(err);
        reject(err);
      });
    });
  });
}
  
  // `closeServer` function is here in original code
  

//config for mongoose, check sample code
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

  
module.exports = {app, runServer, closeServer};


