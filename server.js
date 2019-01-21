'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;
process.env.MONGOLAB_URI = 'mongodb://user:password11@ds161764.mlab.com:61764/url_shortner_database';
/** this project needs a db !! **/
 mongoose.connect(process.env.MONGOLAB_URI, {useNewUrlParser: true});


/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/src'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/public/index.html');
});



var handlers = require('./handlers.js');

// your first API endpoint...
app.post("/api/shorturl/new", handlers.postHandler);

app.get("/api/shorturl/:short_url", handlers.getHandler);


app.listen(port, function () {
  console.log('Node.js listening ...');
});
