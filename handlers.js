'use strict';

var UrlStore = require('./model.js');
var dns = require('dns');

var urlRegex = /^https?:\/\/[\w.\-_]+[\/.]*/i;
var hostnameRegex = /^([a-z0-9\-_]+\.)+[a-z0-9\-_]+/i;


var validUrl = function(str){
  console.log(str);
  console.log('validating url protocol....');
  return (urlRegex.test(str)) ? true : false;
}


var createUrlInStore = function(req, res){
       UrlStore.find({}) //to get current number of entries in database and evaluate index
        .then((data) => {
           var url = new UrlStore({url: req.body.url, index: data.length + 1}); //url constructor
           return url;
        })
        .then(url => {
           console.log('creating object \n' + url);
           url.save() //push url to database
           .then((urlObject) => {
              console.log('Short Url created successfully :)');
              res.json({original_url: urlObject.url, short_url: urlObject.index});
           })
       })
       .catch((e) => {
         console.log('Operation failed! \n' + e.stack);
         res.status(400).send({'error': 'OPERATION FAILED'});
       })
}

var findUrlInStore = function(req, res){
     console.log('Yay! Host is valid. Checking url in database...');
     UrlStore.findOne({url: req.body.url})
       .then((data) => {
         if(data){ //if success
          console.log('Url found!!');
          res.json({original_url: req.body.url, short_url: data.index});
         }
         else{ //not found
          console.log('Url not found. Creating one in database...');
          createUrlInStore(req, res);
         }
    })
    .catch((e) => {
      console.log('Operation failed! \n' + e.stack);
      res.status(400).send({'error': 'OPERATION FAILED'});
    })
}

exports.postHandler = function(req, res){
     if(!validUrl(req.body.url)){
        console.log('invalid url');
        res.json({error: 'invalid url'});
    }else {
        console.log('Yay! Url is valid.')
        var hostname = req.get('host');
        if(hostname){
            dns.lookup('' + hostname, function(err) {
                if(err) {
                    console.log('Uh Oh! Invalid host');
                    res.json({error: 'invalid hostname'});
                }
                else findUrlInStore(req, res);
          });
       }
   }
}



exports.getHandler = function (req, res) {
   UrlStore.findOne({index: req.params.short_url})
   .then((data) => {
     console.log('retreiving url from database...');
     if(!data) return res.status(404).send('Oops. No URL found here.');
     res.redirect(data.url);
   })
   .catch((e) => {
     console.log('Operation failed! \n' + e.stack);
     res.status(400).send({'error': 'OPERATION FAILED'});
   })
}
