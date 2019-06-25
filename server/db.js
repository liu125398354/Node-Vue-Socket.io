/**
 * Created by liunannan on 2018/1/5.
 */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/chat', {
  useMongoClient: true
});

const db = mongoose.connection;
db.on('error', () => console.log('Mongo connection error'));
db.once('open', () => console.log('Mongo connection successed'));

module.exports = db;
