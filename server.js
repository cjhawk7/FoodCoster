const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
require('dotenv').config();
const jsonParser = bodyParser.json();
const {PORT, DATABASE_URL} = require('./config');
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const {userList} = require('./models');
const {authList} = require('./users/models');
const passport = require('passport');
mongoose.Promise = global.Promise;


app.use(express.static('public'));
app.use(morgan('common'));
app.use(express.json());
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);


console.log('db url', DATABASE_URL);

const jwtAuth = passport.authenticate('jwt', { session: false });


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
  console.log('/makeRequest/:cityName');
  var instance = axios.create();

  instance.get(`https://www.numbeo.com/api/city_prices?api_key=4uxocu7eiqwid6&query=${req.params.cityName}&currency=USD`, {
    headers: {'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE',
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

app.get('/searchData', jwtAuth, (req, res) => {
  console.log(req.user);
  authList
    .findById(req.user._id)
    .populate('posts')
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


app.post('/searchData', jsonParser, jwtAuth, (req, res) => {
console.log('reqbody', req.body);
console.log(req);
  const requiredFields = ['budget', 'location', 'time', 'meals', 'info'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  return userList
    .create({
      budget: req.body.budget,
      location: req.body.location,
      meals: req.body.meals,
      time: req.body.time,
      info: req.body.info
    })
    .then(
      searchObject => {
        authList.findByIdAndUpdate(req.user._id, 
          { $push : {posts:searchObject._id}}
        )
        .then(()=>res.status(201).json(searchObject.serialize()))
      })
      
    

    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Internal server error'});
    });
});


app.put('/searchData/:id', jwtAuth, (req, res) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['budget', 'location', 'time', 'meals'];

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

app.delete('/searchData/:id', jwtAuth, (req, res) => {
  userList
    .findByIdAndRemove(req.params.id)
    console.log(req.params.id)
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
        mongoose.disconnect()
          .on('error', err => {
            mongoose.disconnect();
            console.log(err);
            reject(err);
          });
      });
    });
  });
} 
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



