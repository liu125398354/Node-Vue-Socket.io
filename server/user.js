/**
 * Created by liunannan on 2017/12/24.
 */
const mongoose = require('mongoose');
const db = require('./db.js');

const loginSchema = mongoose.Schema({
  account: String,
  password: String,
  image: String,
  identity: Number
});

loginSchema.statics.findUser = function(account, callback) {
  this.model('login').findOne({account: account}, callback);
};

loginSchema.statics.findAll = function(callback) {
  this.model('login');
};

loginSchema.methods.comparePassword = function(password) {
  if (this.password === password) {
    return true;
  } else {
    return false;
  }
};

const loginModel = db.model('login', loginSchema);

module.exports = loginModel;
