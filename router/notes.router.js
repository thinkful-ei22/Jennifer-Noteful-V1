'use strict';

const express = require('express');
const router = express.Router();
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.post('/',(req, res, next)=>{
  const {title, content} = req.body;
  const newItem = {title, content};
  if (!newItem.title) {
    const err = new Error('Missing title in request body');
    err.status = 400;
    return next(err);
  }
  if (!newItem.content) {
    const err = new Error('Missing content in request body');
    err.status = 400;
    return next(err);
  }
  notes.create(newItem)
    .then(item => {
      if (item){
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/:id', (req, res, next)=>{
  const id = req.params.id;
  notes.delete(id)
    .then(len =>{
      if(len){
        console.log(`Deleted note ${id}`);
        res.status(204).end();
      }
      else{
        next('Item to be deleted could not be found');
      }
    })
    .catch(err => {
      next(err);
    });  
});

router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm)
    .then(list => {
      if(list){
        res.json(list);
      }
    })
    .catch(err =>{
      next(err);
    });
});

router.get('/:id', (req, res, next)=>{
  const id = req.params.id;
  notes.find(id)
    .then(item => {
      if(item){
        res.json(item);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
 
router.put('/:id', (req, res, next) => {
  const id = req.params.id;  
  /**** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  if (!updateObj.title) {
    const err = new Error('Missing title in request body');
    err.status = 400;
    return next(err);
  }
  else if (!updateObj.content) {
    const err = new Error('Missing content in request body');
    err.status = 400;
    return next(err);
  }
  notes.update(id, updateObj)
    .then(item => {
      if(item){
        res.json(item);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


module.exports=router;
