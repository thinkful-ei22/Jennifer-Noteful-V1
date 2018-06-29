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
        expect(res.body.length).to.equal(10);
        const expectedKeys =['id', 'title', 'content'];
        res.body.forEach(function(note){
          expect(note).to.be.a('object');
          expect(note).to.include.keys(expectedKeys);
        });
      });
  });
  it('should return correct search results for a valid query', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=about%20cats')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(4);
        expect(res.body[0]).to.be.an('object');
      });
  });
  it('should return an empty array for an incorrect query', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=Not%20a%20Valid%20Search')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });
});

describe('GET note by id', function(){
  it('should return one note with the matching id', function(){
    return chai.request(app)
      .get('/api/notes/1000')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.title).to.equal('5 life lessons learned from cats');
      });
  });
  it('should return 404 with invalid id', function(){
    return chai.request(app)
      .get('/api/notes/DOESNOTEXIST')
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });
});

describe('POSt new note', function(){
  it('should create and return a new item with location header when provided valid data', function(){
    const newNote = {title: 'Sample Title', content: 'This is an article about cats'};
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newNote, {id: res.body.id}));
      });
  });
  it('should return an object with a message property "Missing title in request body" when missing "title" field', function(){
    const newNote = {title: null, content:'This will not work because of missing title'};
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res){
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('Missing title in request body');
      });
  });
  it('should return an object with a message property "Missing content in request body" when missing "content" field', function(){
    const newNote = {title: 'Broken', content: null};
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res){
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('message');
        expect(res.body.message).to.equal('Missing content in request body');
      });
  });
});

// describe('PUT to updata specific note', function(){

// });

// describe('DELETE a specific note', function(){

// });