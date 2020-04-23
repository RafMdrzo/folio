const db = require('../models/db.js');
const assert = require('assert');
const mongo = require('mongodb');

const Follower = require('../models/Follower.js');
const Following = require('../models/Following.js');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/folioDB';

const followController = {
  follow: async function(req,res) {
    var userQuery = req.session.username;
    var follow = req.body.follow;

    db.insertOne(Follower, {user: follow, follower: userQuery}, function(flag1) {
      db.insertOne(Following, {user: userQuery, following: follow}, function(flag2) {
        if(flag1 == true) {
          console.log("flag1 " + flag1);
          if(flag2 == true) {
            console.log("flag2 " + flag2);
            res.send(true)
          }
          else {
            res.send(false);
          }
        }
      });
    });
  },

  unfollow: (req, res) => {
    var currentUser = req.session.username;
    var follow = req.body.follow;
    var flag = false;

    db.deleteOne(Follower, {user: follow, follower: currentUser}, function(flag1) {
      db.deleteOne(Following, {user: currentUser, following: follow}, function(flag2) {
        if(flag1 == true) {
          console.log("flag1 " + flag1);
          if(flag2 == true) {
            console.log("flag2 " + flag2);
            res.send(true)
          }
          else {
            res.send(false);
          }
        }
      });
    });
  }
}

module.exports = followController;
