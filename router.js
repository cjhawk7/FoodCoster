const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
    res.json(Recipes.get());
  });


  module.exports = router;