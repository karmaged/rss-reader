var mongoose = require('mongoose'),
    MongooseSchema = mongoose.Schema,
    passportlm = require('passport-local-mongoose');

var User = new MongooseSchema({
  email: String
});
User.plugin(passportlm);

module.exports = mongoose.model('User', User);

