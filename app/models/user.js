var mongoose = require('mongoose'),
    MongooseSchema = mongoose.Schema,
    passportlm = require('passport-local-mongoose');

var User = new MongooseSchema({
  subscribitions: Array
});
User.plugin(passportlm);

module.exports = mongoose.model('User', User);

