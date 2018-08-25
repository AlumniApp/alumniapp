const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');
require('../models/User');
const User = mongoose.model('users');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    if(req.user.utype === 'Admin')
    {
     User.find({status:''})
     .then(user => {
       res.render('users/admin',{
         user:user
       })
     })
    }
    else {
    Idea.find({user: req.user.id})
      .sort({date:'desc'})
      .then(ideas => {
        res.render('ideas/index', {
          ideas:ideas
        });
      });
    }
  });

  router.put('/approve/:id', (req,res) => {
     
    User.findOne({_id:req.params.id})
    .then(user => {
        // new values
        user.status = 'approved';
    
    
        user.save()
          .then(user => {
            req.flash('success_msg', 'user approved');
            res.redirect('/dashboard');
          })
      });
    

  })

  module.exports = router;