const db = require('../models/db.js');
const assert = require('assert');
const mongo = require('mongodb');
// import module `User` from `../models/UserModel.js`
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/folioDB';
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const bcrypt = require('bcryptjs');

// defines an object which contains functions executed as callback
// when a client requests for `signup` paths in the server
const loginController = {

  // executed when the client sends an HTTP GET request `/login`
  // as defined in `../routes/routes.js`
  getLogIn: async function (req, res) {
    if(req.session.loggedin != true) {
      res.render('login', {layout: false});
    }
    else {
      res.redirect('/home');
    }
  },

  // executed when the client sends an HTTP POST request `/signup`
  // as defined in `../routes/routes.js`
  postLogIn: async function (req, res) {

    // when submitting forms using HTTP POST method
    // the values in the input fields are stored in the req.body object
    // each <input> element is identified using its `name` attribute
    // Example: the value entered in <input type="text" name="fName">
    // can be retrieved using req.body.fName
    var query = {username: req.body.username};

    // fields to be returned
    var projection = 'username password avatar imgType';

    db.findOne(User, query, projection, function(result) {
      if(result != null) {
        if(req.body.username == result.username) {

          bcrypt.compare(req.body.password, result.password, function(err, searchRes) {
              // res === false
              if(searchRes === true){
                req.session.username = result.username;
                req.session.loggedin = true;
                res.redirect("/home");
              } else {
                res.redirect("/");
              }
          });
          
        }
      }
      else {
      res.redirect("/");
      }
    });
  }

}

// exports the object `signupController` (defined above)
// when another script exports from this file
module.exports = loginController;
