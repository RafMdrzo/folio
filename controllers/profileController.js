const db = require('../models/db.js');
const assert = require('assert');
const mongo = require('mongodb');

// import module `User` from `../models/UserModel.js`
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const Following = require('../models/Following.js');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/folioDB';
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const sizeOf = require('image-size');


const profileController = {
  getSelfProfile: async (req, res)=>{
    if(req.session.loggedin != true) {
      res.render('login', {layout: false});
    }
    else {
      var currentUser = req.session.username;

      var query = {username: currentUser};

      var projection = 'avatar username fullName bio location imgType';

      db.findOne(User, query, projection,
        (result)=>{
          if(result != null){
            var resulter = [];

            db.findMany(Post, {user: result.username}, '_id postpic imgType', (postRes)=>{

              for(i = 0; i < postRes.length; i++){
                var postMirror = {
                  id: 'a' + `${postRes[i]._id}`,
                  path: `data:${postRes[i].imgType};charset=utf-8;base64,${postRes[i].postpic.toString('base64')}`,
                  orientation: 'modal-img'
                };

                var base64 = postRes[i].postpic.toString('base64');
                var img = Buffer.from(base64, 'base64')
                var dimensions = sizeOf(img);

                postMirror.orientation = dimensions.width > dimensions.height ? 'modal-img' : 'modal-img-vert';
                resulter.push(postMirror);
              }
              res.render('profile', {
                mystatus: result.emailConf,
                myavatar: `data:${result.imgType};charset=utf-8;base64,${result.avatar.toString('base64')}`,
                avatar: `data:${result.imgType};charset=utf-8;base64,${result.avatar.toString('base64')}`,
                bio: result.bio,
                location: result.location,
                username: result.username,
                name: result.fullName,
                posts: resulter,
                custom_nav: '<button type="button" class="dropdown-item btn-light" id="getdat" data-toggle="modal" data-target="#profset">Profile Settings</button>'
              });



            });

            } else {
              res.send(500 + " Can't find the user");
            }
          });
        }

      },

      getUserProfile: async (req, res)=>{
        if(req.session.loggedin != true) {
          res.render('login', {layout: false});
        }
        else {
          var currentUser = req.params.username;

          var query = {username: currentUser};

          var projection = 'avatar username fullName bio location imgType';

          db.findOne(User, query, projection,
            (result)=>{
              if(result != null){
                var resulter = [];
                db.findMany(Post, {user: result.username}, '_id postpic imgType', (postRes)=>{

                  for(i = 0; i < postRes.length; i++){
                    var postMirror = {
                      id: 'a' + `${postRes[i]._id}`,
                      path: `data:${postRes[i].imgType};charset=utf-8;base64,${postRes[i].postpic.toString('base64')}`,
                      orientation: 'modal-img'
                    };

                    var base64 = postRes[i].postpic.toString('base64');
                    var img = Buffer.from(base64, 'base64')
                    var dimensions = sizeOf(img);

                    postMirror.orientation = dimensions.width > dimensions.height ? 'modal-img' : 'modal-img-vert';
                    resulter.push(postMirror);
                  }
                  var myUser = req.session.username;
                    var projectNew = 'imgType avatar emailConf';
                    var findFollow = 'user following';
                    var followVal;

                    db.findMany(Following, {user: myUser}, findFollow, (followRes)=>{
                      if(followRes != null)
                      {
                        for(i = 0; i < followRes.length; i++)
                        {
                          if(followRes[i].following == currentUser){
                            followVal = true;
                          }
                          else {
                            followVal = false;
                          }
                        }
                      }
                      else {
                        followVal = false;
                      }
                    });

                    db.findOne(User, {username: myUser}, projectNew, (checkRes)=>{
                      if(checkRes != null)
                      {
                        var userMirror = {
                          mystatus: checkRes.emailConf,
                          myavatar: `data:${checkRes.imgType};charset=utf-8;base64,${checkRes.avatar.toString('base64')}`,
                          avatar: `data:${result.imgType};charset=utf-8;base64,${result.avatar.toString('base64')}`,
                          bio: result.bio,
                          location: result.location,
                          username: result.username,
                          name: result.fullName,
                          posts: resulter,
                          status: myUser != currentUser ? true : false,
                          follow: followVal
                        }

                        res.render('profile', userMirror);
                      } else {
                        res.send(500 + ' Error loading');
                      }
                    })



                });
              } else {
                res.send(500 + " Can't find the user");
              }
            });
          }

        },

        postEditProfile: (req, res)=> {
          var newbio = req.body.newbio;
          var newloc = req.body.newloc;
          var newavatar = req.body.newavatar;
          var newusername = req.body.newhandle;
          console.log(newavatar);
          var currentUser = req.session.username;
          var filter = {username: currentUser};

          if(newavatar != null)
          {
            try{
              var pic = JSON.parse(newavatar);
              if(pic != null && imageMimeTypes.includes(pic.type))
              {
                var dat = new Buffer.from(pic.data, 'base64');
                var dattype = pic.type;

                db.updateOne(User, filter, {
                  bio: newbio,
                  username: newusername,
                  location: newloc,
                  avatar: dat,
                  imgType: dattype
                });
              }
            } catch(err){
              console.log('No Uploaded image');
              db.updateOne(User, filter, {
                bio: newbio,
                username: newusername,
                location: newloc
              });
            }

          } else {
            db.updateOne(User, filter, {
              bio: newbio,
              username: newusername,
              location: newloc
            });
          }

          res.redirect(req.get('referer'));
        },

        postEditEmail: (req, res)=> {
          var newemail = req.body.newemail;
          var currentUser = req.session.username;
          var filter = {username: currentUser};
          console.log(newemail);

          if(newemail != "")
          {
            db.updateOne(User, filter, {
              email: newemail
            });
          }

          res.redirect(req.get('referer'));
        },

        postChangePassword: (req,res)=> {
          var newpass = req.body.newpass;
          var confnewpass = req.body.confpass;
          var currentUser = req.session.username;
          var filter = {username: currentUser};

          if((newpass != "") && (confnewpass != "") && (newpass == confnewpass))
          {
            db.updateOne(User, filter, {
              password: confnewpass
            });
          }

          res.redirect(req.get('referer'));
        },
      }

      module.exports = profileController;
