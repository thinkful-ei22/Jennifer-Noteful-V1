'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function(){
  it('GET request "/" shouldreturn the index page', function(){
    return chai.request(app)
      .get('/')
      .then(function(res){
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function(){
  it('should respond with 404 when given a bad path', function(){
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });
});

describe('GET list of notes', function(){
  it('GET request should return a list of notes with a 200 status', function(){
    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys =['id', 'title', 'content'];
        res.body.forEach(function(note){
          expect(note).to.be.a('object');
          expect(note).to.include.keys(expectedKeys);
        }); 
      });
  });
});

describe('GET note by id', function(){

});

describe('POSt new note', function(){

});

describe('PUT to updata specific note', function(){

});

describe('DELETE a specific note', function(){

});