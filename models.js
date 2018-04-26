const mongoose = require('mongoose');



const foodSchema = mongoose.Schema({
    
    budget: {type: String, required: true},
    location: {type: String, required: true},
    time: {type: String, required: true}
  });