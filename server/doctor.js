/**
 * Created by liunannan on 2018/1/5.
 */
const mongoose = require('mongoose');
// const db = require('./db.js');

const doctorSchema = mongoose.Schema({});
const doctorModel = mongoose.model('doctor', doctorSchema, 'doctors');

module.exports = doctorModel;
