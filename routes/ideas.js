const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');
require('../models/User');
const User = mongoose.model('users');

// Idea Index Page



// Add Idea Form
router.get('/ideas/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('ideas/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/dashboard');
    } else {
      res.render('ideas/edit', {
        idea:idea
      });
    }
    
  });
});

// Process Form
router.post('/ideas', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.email
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'idea added');
        res.redirect('/dashboard');
      })
  }
});

// Edit Form process
router.put('ideas/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', 'idea updated');
        res.redirect('/ideas');
      })
  });
});

// Delete Idea
router.delete('ideas/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'idea removed');
      res.redirect('/dashboard');
    });
});

router.get('/about', (req,res) => {
Idea.find()
.then(idea => {
  res.render('about', {
    idea:idea
  })
})
})

module.exports = router;