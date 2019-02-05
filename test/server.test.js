"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chaiHttp = require('chai-http');
const server = require('../server');
const UrlStore = require('../model/model');
const chai = require('chai');
const should = chai.should();

chai.use(chaiHttp);


describe('Database Tests', function() {
 /*
    Test the /GET/:short_url route
   */
   describe('/GET/api/shorturl/:short_url', () => {

       afterEach((done) => {
         UrlStore.deleteOne({}, (err) => {
           done();
         });
      });

       it('it should GET a Url by the given short_url as index', (done) => {
           let url = new UrlStore({ url : 'https://www.freecodecamp.com', index: 1 });
           url.save((err, url) => {
              chai.request(server)
             .get('/api/shorturl/1')
             .end((err, res) => {
                   res.should.have.status(200);
               done();
             });
           });

       });

       it('it should respond with 404 when index is not found', (done) => {
              chai.request(server)
             .get('/api/shorturl/' + 44)
             .end((err, res) => {
                   res.should.have.status(404);
               done();
             });
           });
   });


   describe('/POST url', () => {
        it('it should POST a url ', (done) => {
              chai.request(server)
              .post('/api/shorturl/new')
              .type('form')
              .send({url: 'https://www.netflix.com'})
              .end((err, res) => {
                  //res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('original_url').eql('https://www.netflix.com');
                  res.body.should.have.property('short_url').eql(1);
              done();
            });
      });

  it('it should respond with existing object if url already exists ', (done) => {
        chai.request(server)
        .post('/api/shorturl/new')
        .type('form')
        .send({url: 'https://www.netflix.com'})
        .end((err, res) => {
            //res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('original_url').eql('https://www.netflix.com');
            res.body.should.have.property('short_url').eql(1);
        done();
      });
   });

   it('it should increment index for new url entry ', (done) => {
         chai.request(server)
         .post('/api/shorturl/new')
         .type('form')
         .send({url: 'https://www.freecodecamp.com'})
         .end((err, res) => {
             //res.should.have.status(200);
             res.body.should.be.a('object');
             res.body.should.have.property('original_url').eql('https://www.freecodecamp.com');
             res.body.should.have.property('short_url').eql(2);
         done();
       });
    });

    it('it should respond with error on invalid url format ', (done) => {
          chai.request(server)
          .post('/api/shorturl/new')
          .type('form')
          .send({url: 'htt://www.freecodecamp.com'})
          .end((err, res) => {
              //res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('invalid url');
          done();
        });
     });

});

//After all tests are finished drop database and close connection
 after(function(done){
   mongoose.connection.db.dropDatabase(function(){
     mongoose.connection.close(done);
   });
 });

});
