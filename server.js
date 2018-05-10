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
app.use(express.json());
const {PORT, DATABASE_URL} = require('./config');
const {userList} = require('./models');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/makeRequest/:cityName', function (req, res) {
  var instance = axios.create();

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

app.get('/searchData', (req, res) => {
  userList
    .find()
    .then(searchData => {
      res.json({
        budget: 500,
        location: 'Phoenix',
        time: 1
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

app.post('/searchData', jsonParser, (req, res) => {
console.log(req.body);
  const requiredFields = ['budget', 'location', 'time'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  userList
    .create({
      budget: req.body.budget,
      location: req.body.location,
      time: req.body.time
    })
    .then(
      searchObject => res.status(201).json(searchObject.serialize()))

    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Internal server error'});
    });
});


app.put('/searchData/:id', (req, res) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    // we return here to break out of this function
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['budget', 'location', 'time'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  userList
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(searchObject => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/searchData/:id', (req, res) => {
  userList
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        console.log(err);
        return reject(err);
      }
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




