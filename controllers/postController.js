function diff_hours(dt2, dt1)
{
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return diff;
}

const db = require('../models/db.js');
const assert = require('assert');
const sizeOf = require('image-size');

// import module `User` from `../models/UserModel.js`
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const Comment = require('../models/Comment.js');
const Like = require('../models/Likes.js');
const Following = require('../models/Following.js');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/folioDB';
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const bcrypt = require('bcrypt');

const postController = {
  getAbout: async function (req, res) {
    if(req.session.loggedin == true) {
      var myUser = req.session.username;
      db.findOne(User, {username: myUser}, 'imgType avatar', (userRes)=>{

        if(userRes != null)
        {
          res.render('about', {
            dependencies: [ {name: "assert", version: "2.0.0"},
                            {name: "bcrypt", version: "4.0.1"},
                            {name: "bcryptjs", version: "2.4.3"},
                            {name: "body", version: "5.1.0"},
                            {name: "body-parser", version: "1.19.0"},
                            {name: "cjs", version: "0.0.11"},
                            {name: "express", version: "4.17.1"},
                            {name: "express-handlebars", version: "4.0.0"},
                            {name: "express-session", version: "1.17.0"},
                            {name: "filepond", version: "4.13.0"},
                            {name: "filepond-plugin-file-encode", version: "2.1.5"},
                            {name: "filepond-plugin-image-resize", version: "2.0.4"},
                            {name: "grunt", version: "1.1.0"},
                            {name: "grunt-contrib-cssmin", version: "3.0.0"},
                            {name: "grunt-contrib-uglify", version: "4.0.1"},
                            {name: "grunt-contrib-watch", version: "1.1.0"},
                            {name: "hbs", version: "4.1.1"},
                            {name: "image-size", version: "0.8.3"},
                            {name: "install", version: "0.13.0"},
                            {name: "minify", version: "5.1.1"},
                            {name: "mongo", version: "0.1.0"},
                            {name: "mongodb", version: "2.2.33"},
                            {name: "mongoose", version: "5.9.6"},
                            {name: "node-addon-api", version: "2.0.0"},
                            {name: "node-pre-gyp", version: "0.14.0"},
                            {name: "node-supervisor", version: "1.0.2"},
                            {name: "nodemailer", version: "6.4.6"},
                            {name: "npm", version: "6.14.4"},
                            {name: "parser", version: "0.1.4"},
                            {name: "passport", version: "0.4.1"},
                            {name: "passport-local", version: "1.0.0"},
                            {name: "supervisor", version: "0.12.0"},
                            {name: "supervisord", version: "0.1.0"},
                            {name: "typed.js", version: "2.0.11"}
                          ],
            myavatar:  `data:${userRes.imgType};charset=utf-8;base64,${userRes.avatar.toString('base64')}`
          });
        }
      });
    }
    else {
      res.redirect('/');
    }
  },
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
          }, (result)=>{
            console.log("Added 1 Post");
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

            }, (result)=>{
              console.log("Added 1 Post");

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
          var imgTypeRes = '';

          //will contain the values that hbs can recognize
          var postResulter = [];
          var commentResulter = [];
          var userResulter = [];
          var likeResulter = [];
          var followingResulter = [];

          //projections
          var postProjection = '_id user title description dateCreated postpic imgType';
          var commentProjection = '_id post text user dateCreated';
          var userProjection = 'username avatar imgType emailConf';
          var likeProjection = 'post user'
          var followingProjection = "following";
          var myUser = req.session.username;

          //arrays that contain the values to be recognized by the $in evaluator in findMany
          var commentIN = [];
          var postIN = [];
          var likeIN = [];
          var followingIN = [];
          var userCommIN = [];
          //what hbs will render
          var finalResulter = [];

          //find logged in user
          db.findOne(User, {username: myUser}, userProjection, (userRes)=>{
            if(userRes != null)
            {
              //find people you follow
              db.findMany(Following, {user: myUser}, followingProjection, (followingRes)=>{
                for(i = 0; i < followingRes.length; i++){
                  followingIN.push(followingRes[i].following);
                }

                followingIN.push(userRes.username);

                //find posts associated to the people the user follows
                db.findMany(Post, {user: {$in: followingIN}}, postProjection, (postRes)=>{
                  //generate array for filtering posts in comment
                  for(i = 0; i < postRes.length; i++){
                    commentIN.push('a' + postRes[i]._id);
                  }

                  //look for posts the user liked
                  db.findMany(Like, {user: myUser}, likeProjection, (likeRes)=>{

                    //look for comments associated to the post
                    db.findMany(Comment, {post: {$in: commentIN}}, commentProjection, (commentRes)=>{
                      if(commentRes != null){
                        //generate a filter to assign avatar and user in comments
                        for(i = 0; i < commentRes.length; i++){
                          userCommIN.push(commentRes[i].user);
                        }

                        userCommIN.push(userRes.username);

                        //look for the avatar and username assigned to each commenting user
                        db.findMany(User, {username: {$in: userCommIN}}, userProjection, (commUserRes)=>{
                          if(commUserRes != null){
                            //store comments
                            for(i = 0; i < commentRes.length; i++){
                              var commentMirror = {
                                virtualPath: null,
                                text: commentRes[i].text,
                                name: commentRes[i].user,
                                dateCreated: commentRes[i].dateCreated,
                                post_id: commentRes[i].post,
                                checked: false,
                                userChecked: commentRes[i].user == req.session.username ? true : false
                              }
                              commentResulter.push(commentMirror);
                            }//end comment push

                            for(i = 0; i < commUserRes.length; i++){
                              for(j = 0; j < commentResulter.length; j++)
                              {
                                if(commUserRes[i].username == commentResulter[j].name)
                                {
                                  commentResulter[j].virtualPath = `data:${commUserRes[i].imgType};charset=utf-8;base64,${commUserRes[i].avatar.toString('base64')}`;

                                }
                              }
                            }
                            //start processing likes
                            for(i = 0; i < likeRes.length; i++){
                              var likeMirror = {
                                post_id: 'a' + likeRes[i].post,
                                user: likeRes[i].user,
                                checked: false
                              }
                              likeResulter.push(likeMirror);
                            }//end like process

                            //start processing posts by pushing it to finalResulter
                            for(i = 0; i < postRes.length; i++){
                              var elapsed = diff_hours(new Date(Date.now()), new Date(postRes[i].dateCreated));

                              var postMirror = {
                                post_image: `data:${postRes[i].imgType};charset=utf-8;base64,${postRes[i].postpic.toString('base64')}`,
                                post_title: postRes[i].title,
                                post_description: postRes[i].description,
                                post_author: postRes[i].user,
                                post_elapsed: elapsed > 24 ? (Math.floor(elapsed/24) > 1 ? (Math.floor(elapsed/24) + ' days ago') : '1 day ago') :  ( Math.floor(elapsed) == 1? (Math.floor(elapsed) + ' hour ago') : (Math.floor(elapsed) > 1 ? (Math.floor(elapsed) + ' hours ago') : (Math.floor(elapsed*60) <= 1 ? '1 minute ago' : (Math.floor(elapsed*60) + ' minutes ago')))),
                                post_id: 'a' + postRes[i]._id,
                                status: postRes[i].user == myUser ? true : false,
                                comment: [],
                                edit_id: 'aa' + postRes[i]._id,
                                liked: false,
                                orientation: 'photo',
                              }

                              var base64 = postRes[i].postpic.toString('base64');
                              var img = Buffer.from(base64, 'base64')
                              var dimensions = sizeOf(img);

                              postMirror.orientation = dimensions.width > dimensions.height ? 'photo' : 'photovert';

                              finalResulter.push(postMirror);
                            }//end processing posts to final resulter

                            //process comments to final resulter
                            for(i = 0; i < finalResulter.length; i++){
                              for(j = 0; j < commentResulter.length; j++){

                                if(commentResulter[j].checked == false  && commentResulter[j].post_id == finalResulter[i].post_id){
                                  finalResulter[i].comment.push(commentResulter[j]);
                                  commentResulter[j].checked = true;
                                }
                              }
                            }
                            //process likes to final resulter
                            for(i = 0; i < finalResulter.length; i++){
                              for(j = 0; j < likeResulter.length; j++){
                                var ogID = 'a' + likeResulter[j].post_id.substr(1);

                                if(likeResulter[j].checked == false && finalResulter[i].post_id == ogID){
                                  finalResulter[i].liked = true;
                                  likeResulter[j].checked = true;
                                }
                              }
                            }//end processing likes to final resulter

                            res.render('home',{
                              mystatus: userRes.emailConf,
                              myavatar:  `data:${userRes.imgType};charset=utf-8;base64,${userRes.avatar.toString('base64')}`,
                              post: finalResulter
                            })
                          }
                        });//end avatar searcg
                        //process found posts
                      }
                    });//end comment finder
                  });//end like finder
                });//end post finder
              });//end find people you follow
            }
          });//end User findOne
        }
      },

      postEditPost: (req, res)=>{
        var modifiedPostID = req.body.hidden_editID;
        var originalID = modifiedPostID.substring(1);
        var reqTitle = req.body.edit_title;
        var reqDesc = req.body.edit_desc;
        var editMirror = {
          title: reqTitle,
          description: reqDesc,
        }

        var filter = {_id: originalID};
        db.updateOne(Post, filter,
          {
            title: reqTitle,
            description: reqDesc
          });
        res.send(editMirror);
        },

        postDeletePost: (req, res) =>{
          var modifiedPostID = req.body.hidden_deleteID;
          var originalID = modifiedPostID.substring(1);

          var conditions = {_id: originalID}

          db.deleteOne(Post, conditions, (result)=>{});
          db.deleteMany(Comment, {post: modifiedPostID}, (result)=>{});
          //res.redirect('/home');
        }
      };

      module.exports = postController;
