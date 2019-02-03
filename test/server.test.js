"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chaiHttp = require('chai-http');
const server = require('../server');
const chai = require('chai');
const should = chai.should();
// Create a new schema that accepts a 'name' object.
// 'name' is a required field
chai.use(chaiHttp);

const testSchema = new Schema({
  url: { type: String, required: true },
  index: {type: Number, required: true}
});
//Create a new collection called 'Name'
const UrlStore = mongoose.model('UrlStore', testSchema);
describe('Database Tests', function() {
  //Before starting the test, create a sandboxed database connection
  //Once a connection is established invoke done()
  before(function (done) {
    mongoose.connect('mongodb://user:password11@ds221155.mlab.com:21155/test_database',  {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      console.log('We are connected to test database!');
      done();
    });
  });


  beforeEach((done) => {
    UrlStore.deleteOne({}, (err) => {
      done();
    });
 });

 /*
   * Test the /GET/:id route
   */
   describe('/GET/api/shorturl/:short_url site', () => {
       it('it should GET a Url by the given short_url as index', (done) => {
           let url = new UrlStore({ url : 'https://www.freecodecamp.com', index: 1 });
           url.save((err, url) => {
              chai.request(server)
             .get('/api/shorturl/' + url.index)
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
