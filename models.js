const mongoose = require('mongoose');



const searchSchema = mongoose.Schema({
    
    budget: {type: Number, required: true},
    location: {type: String, required: true},
    time: {type: Date, required: true}

  });

 // need to use virtuals?  

searchSchema.methods.serialize = function() {
  return {
    budget: this._budget,
    location: this.location,
    time: this.time,
  };
}

  const userList = mongoose.model('userList', searchSchema);

  module.exports = {userList};
  