'use strict';

var UrlStore = require('./model.js');
var dns = require('dns');

var urlRegex = /^https?:\/\/[\w.\-_]+[\/.]*/i;
var hostnameRegex = /^([a-z0-9\-_]+\.)+[a-z0-9\-_]+/i;

var extractHostname = function(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
   if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
   return hostname;
}


var extractRootDomain = function(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}


var validateUrl = function(str){
  return (urlRegex.test(str)) ? true : false;
}




exports.postHandler = function(req, res){
  if(validateUrl(req.body.url)){
    var hostname = extractRootDomain(req.body.url);
      console.log(hostname);
      if(hostname){
         dns.lookup('' + hostname, function(err) {
            if(err) {res.json({error: 'invalid hostname'});}
            else{
             UrlStore.findOne({url: req.body.url}, function(err, data){
               if(err) return;
               if(data){
                 res.json({original_url: req.body.url, short_url: data.index});
              }
              else{
                 UrlStore.find({}, function(err, data){
                if(err) return;
                var url = new UrlStore({url: req.body.url, index: data.length + 1});
                url.save(function(err){
                  if(err) return;
                  res.json({original_url: req.body.url, short_url: data.length + 1});
               });
             });
            }
          });
        }
      });
   }
  }else {
    console.log('invalid url');
    res.json({error: 'invalid url'});
  }
}



exports.getHandler = function (req, res) {
   UrlStore.findOne({index: req.params.short_url}, (err, data) => {
      if(err) return;
      res.redirect(data.url);
    })
}
