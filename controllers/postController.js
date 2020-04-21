function diff_hours(dt2, dt1)
{
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return diff;
}

const db = require('../models/db.js');
const assert = require('assert');
const R = require('ramda');
const sizeOf = require('image-size');

// import module `User` from `../models/UserModel.js`
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const Comment = require('../models/Comment.js');
const Like = require('../models/Likes.js');
const Following = require('../models/Following.js');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/folioDB';
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const postController = {
  postAddPost: async function (req, res){
    var query = {username: req.session.username};
    //post contents
    var desc = req.body.descriptor ;
    var post_title = req.body.post_title;
    var picEncoded = req.body.upload;

    if(picEncoded != null)
    {
      var pic = JSON.parse(picEncoded);
      if(pic != null && imageMimeTypes.includes(pic.type))
      {
        var dat = new Buffer.from(pic.data, 'base64');
        var dattype = pic.type;

        db.insertOne(Post,
          {
            postpic: dat,
            imgType: dattype,
            title: post_title,
            description: desc,
            user: req.session.username
          });
          res.redirect('/home');
        } else {
          db.insertOne(Post,
            {
              user: req.session.username,
              title: post_title,
              postpic: null,
              description: desc,
              imgType: ""

            } );
            res.redirect(req.get('referer'));
          }

        }
        else
        {
          res.send(500 + "Error in handling data");
        }
      },
      getHome: async function(req, res){
        if(req.session.loggedin != true) {
          res.render('login', {layout: false});
        }
        else {
          var projection = '_id user title description dateCreated postpic imgType';
          var imgTypeRes = '';

          var postResulter = [];
          var commentResulter = [];
          var userResulter = [];
          var likeResulter = [];
          var customResulter = [];

          var commentProjection = '_id post text user dateCreated';
          var userProjection = 'username avatar imgType';
          var likeProjection = 'post user'
          var myUser = req.session.username;

          var followingResulter = [];

          db.findMany(Post, {}, projection,function(result){
            if(result != null){
              //process post result for views
              var followProjection = 'following user';
              db.findMany(Following, {user: req.session.username}, followProjection, (followRes)=>{
                if(followRes != null)
                {
                  for(i = 0; i < followRes.length; i++)
                  {
                    var followMirror= {
                      following: followRes[i].following,
                      username: followRes[i].user
                    }
                    followingResulter.push(followMirror);

                  }

                  if(followingResulter.length == 0)
                  {
                    for(i = 0; i < result.length; i++)
                    {
                      if(result[i].user == req.session.username)
                      {
                        elapsed = diff_hours(new Date(Date.now()), new Date(result[i].dateCreated));
                        var postMirror = {
                          post_image: `data:${result[i].imgType};charset=utf-8;base64,${result[i].postpic.toString('base64')}`,
                          post_title: result[i].title,
                          post_description: result[i].description,
                          post_author: result[i].user,
                          post_elapsed: elapsed > 24 ? (Math.floor(elapsed/24) > 1 ? (Math.floor(elapsed/24) + ' days ago') : '1 day ago') :  ( Math.floor(elapsed) == 1? (Math.floor(elapsed) + ' hour ago') : (Math.floor(elapsed) > 1 ? (Math.floor(elapsed) + ' hours ago') : (Math.floor(elapsed*60) <= 1 ? '1 minute ago' : (Math.floor(elapsed*60) + ' minutes ago')))),
                          post_id: 'a' + result[i]._id,
                          status: result[i].user == myUser ? true : false,
                          comment: [],
                          edit_id: 'aa' + result[i]._id,
                          liked: false,
                          orientation: 'photo'
                        };
                        var base64 = result[i].postpic.toString('base64');
                        var img = Buffer.from(base64, 'base64')
                        var dimensions = sizeOf(img);

                        postMirror.orientation = dimensions.width > dimensions.height ? 'photo' : 'photovert';
                        postResulter.push(postMirror);
                      }
                    }
                  }

                  for(j = 0 ; j < followingResulter.length; j++)
                  {
                    for(i = 0; i < result.length; i++)
                    {
                      if(followingResulter[j].following == result[i].user || result[i].user == req.session.username)
                      {
                        elapsed = diff_hours(new Date(Date.now()), new Date(result[i].dateCreated));
                        var postMirror = {
                          post_image: `data:${result[i].imgType};charset=utf-8;base64,${result[i].postpic.toString('base64')}`,
                          post_title: result[i].title,
                          post_description: result[i].description,
                          post_author: result[i].user,
                          post_elapsed: elapsed > 24 ? (Math.floor(elapsed/24) > 1 ? (Math.floor(elapsed/24) + ' days ago') : '1 day ago') :  ( Math.floor(elapsed) == 1? (Math.floor(elapsed) + ' hour ago') : (Math.floor(elapsed) > 1 ? (Math.floor(elapsed) + ' hours ago') : (Math.floor(elapsed*60) <= 1 ? '1 minute ago' : (Math.floor(elapsed*60) + ' minutes ago')))),
                          post_id: 'a' + result[i]._id,
                          status: result[i].user == myUser ? true : false,
                          comment: [],
                          edit_id: 'aa' + result[i]._id,
                          liked: false,
                          orientation: 'photo'
                        };
                        var base64 = result[i].postpic.toString('base64');
                        var img = Buffer.from(base64, 'base64')
                        var dimensions = sizeOf(img);

                        postMirror.orientation = dimensions.width > dimensions.height ? 'photo' : 'photovert';
                        postResulter.push(postMirror);
                      }
                    }

                  }

                  //process likes
                  db.findMany(Like, {}, likeProjection, (likeRes)=>{
                    if(likeRes != null){
                      for(i = 0; i < likeRes.length; i++)
                      {
                        var likeMirror = {
                          post_id: 'a' + likeRes[i].post,
                          user: likeRes[i].user
                        }
                        likeResulter.push(likeMirror);
                      }
                    }

                    for(i = 0; i < postResulter.length; i++)
                    {
                      for(j = 0; j < likeResulter.length; j++)
                      {
                        if(postResulter[i].post_id == likeResulter[j].post_id)
                        {
                          if(likeResulter[j].user == myUser)
                          {
                            postResulter[j].liked = true;
                          }
                        }
                      }
                    }
                  });

                  //process comment
                  db.findMany(Comment, {}, commentProjection, (commRes)=>{
                    if(commRes != null){
                      for(i = 0; i < commRes.length; i++)
                      {
                        var commentMirror = {
                          username: commRes[i].user,
                          post_id: commRes[i].post,
                          dateCreated: commRes[i].dateCreated,
                          text: commRes[i].text
                        }

                        commentResulter[i] = commentMirror;
                      }

                      //process user result
                      db.findMany(User, {}, userProjection, (profRes)=>{
                        if(profRes != null){
                          for(i = 0; i < profRes.length; i++)
                          {
                            var userMirror = {
                              username: profRes[i].username,
                              virtualPath:  `data:${profRes[i].imgType};charset=utf-8;base64,${profRes[i].avatar.toString('base64')}`
                            }

                            userResulter.push(userMirror);

                          }

                          for(i = 0; i < postResulter.length; i++)
                          {
                            var finalResulter = [];
                            for(j = 0; j < commentResulter.length; j++)
                            {
                              if(commentResulter[j].post_id == postResulter[i].post_id)
                              {
                                for(n = 0; n < userResulter.length; n++)
                                {
                                  if(userResulter[n].username == commentResulter[j].username)
                                  {
                                    var finalMirror = {
                                      virtualPath: userResulter[n].virtualPath,
                                      text: commentResulter[j].text,
                                      name: userResulter[n].username,
                                    }
                                    postResulter[i].comment.push(finalMirror);
                                  }
                                }
                              }
                            }
                          }

                          //logged-in User
                          var newQuery = {username: req.session.username};
                          var newProjection = 'avatar imgType';
                          db.findOne(User, newQuery, newProjection, async (newRes)=>{
                            if(newRes != null){

                              res.render('home',{
                                myavatar:  `data:${newRes.imgType};charset=utf-8;base64,${newRes.avatar.toString('base64')}`,
                                post: postResulter
                              })
                            }
                          });
                        } else {
                          res.send(500 + 'Error in handling data');
                        }
                      });
                      //process and combine gathered queries from user and comment to show comments in views
                    } else {
                      res.send(500 + 'Error in handling data');
                    }
                  });
                } else {
                  db.findOne(User, newQuery, newProjection, async (newRes)=>{
                    if(newRes != null){

                      res.render('home',{
                        myavatar:  `data:${newRes.imgType};charset=utf-8;base64,${newRes.avatar.toString('base64')}`                      })
                      }
                    });
                  }

                });

              } else {
                res.send(500);
              }
            });
          }
        },

        postEditPost: (req, res)=>{
          var modifiedPostID = req.body.hidden_editID;
          var originalID = modifiedPostID.substr(1);
          var reqTitle = req.body.edit_title;
          var reqDesc = req.body.edit_desc;

          var filter = {_id: originalID};
          db.updateOne(Post, filter,
            {
              title: reqTitle,
              description: reqDesc
            });

            res.redirect(req.get('referer'));

          },

          postDeletePost: (req, res) =>{
            var modifiedPostID = req.body.hidden_deleteID;
            var originalID = modifiedPostID.substr(1);

            var conditions = {_id: originalID}

            db.deleteOne(Post, conditions);
            db.deleteMany(Comment, {post: modifiedPostID});
            res.redirect('/home');

          }
        };

        module.exports = postController;
