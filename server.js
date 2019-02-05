'use strict';

var express = require('express');
var mongo = require('mongodb');
var path = require('path');
var config = require('./config/config.js');
var mongoose = require('mongoose');
var sassMiddleware = require('node-sass-middleware');

var app = express();

// Basic Configuration
var port = process.env.PORT || 8081;
;
/** this project needs a db !! **/
 mongoose.connect(config.DBHost, {useNewUrlParser: true})
        .catch((e) => {
          console.log('Failure to connect to database.');
        });

/** this project needs to parse POST bodies **/
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
//compile sass
var srcPath = __dirname + '/sass';

app.use(sassMiddleware({
  src: srcPath,
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
}));


//mount static assests
app.use(express.static(process.cwd() + '/public'));

//basic-route
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});



var controller = require('./controllers/urlController.js');

//api routes
app.post("/api/shorturl/new", controller.postHandler);

app.get("/api/shorturl/:short_url", controller.getHandler);


var server = app.listen(port, function () {
  console.log('Node.js listening ...');
});

module.exports = server
