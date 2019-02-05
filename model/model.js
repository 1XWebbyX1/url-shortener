'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
  url: String,
  index: Number
});

module.exports = mongoose.model('Url', urlSchema);
