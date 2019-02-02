'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var sassMiddleware = require('node-sass-middleware');

var app = express();

// Basic Configuration
var port = process.env.PORT || 8081;
process.env.MONGOLAB_URI = 'mongodb://user:password11@ds161764.mlab.com:61764/url_shortner_database';
/** this project needs a db !! **/
 mongoose.connect(process.env.MONGOLAB_URI, {useNewUrlParser: true})
        .catch((e) => {
          console.log('Failure to connect to database.');
        })


/** this project needs to parse POST bodies **/
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
//compile sass
var srcPath = __dirname + '/src';
var destPath = __dirname + '/public';

app.use('/public', sassMiddleware({
  src: srcPath,
  dest: destPath,
  debug: true,
  outputStyle: 'expanded'
}));


//mount static assests
app.use('/public', express.static(process.cwd() + '/src'));

//basic-route
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/public/index.html');
});



var handlers = require('./handlers.js');

//api routes
app.post("/api/shorturl/new", handlers.postHandler);

app.get("/api/shorturl/:short_url", handlers.getHandler);


app.listen(port, function () {
  console.log('Node.js listening ...');
});
