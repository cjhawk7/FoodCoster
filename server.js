const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
//app.listen(process.env.PORT || 8080);
const {MOCK_STATUS_UPDATES} = require('./app');

const jsonParser = bodyParser.json();
app.use(morgan('common'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Projects/travel-app/index.html');
  });

app.get('/mock_status_updates', (req, res) => {
    res.json(MOCK_STATUS_UPDATES.get());
});

app.post('/mock_status_updates', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'average_price'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
}

const item = MOCK_STATUS_UPDATES.create(req.body.name, req.body.average_price);
  res.status(201).json(item);
}); 


  let server;

  function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      }).on('error', err => {
        reject(err)
      });
    });
  }

  
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


