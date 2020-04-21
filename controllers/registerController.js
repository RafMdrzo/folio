const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const Likes = require('../models/Likes.js');
const Follower = require('../models/Follower.js');
const Following = require('../models/Following.js');
const Comment = require('../models/Comment.js');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const bcrypt = require('bcryptjs');


const registerController = {
    postRegister: async function(req, res){
        var reqName = req.body.fullName_;
        var reqUsername = req.body.userName_;
        var reqEmail = req.body.email_;
        var reqPw = req.body.pw_;

       

        db.insertOne(User,
            {
                fullName: reqName,
                username : reqUsername,
                email : reqEmail,
                password : reqPw,
                emailConf: false,
                bio : "",
                location : "",
                avatar: null,
                imgType: ""
            } );

            res.redirect('/registerBioLoc?username=' + reqUsername);
    },
    postBioLoc: async function (req, res){
        var filter = {username: req.query.username};

        var reqBio = req.body.bio_assign;
        var reqLoc = req.body.loc_assign;

        var projection = 'bio location';
        db.updateOne(User, filter, 
            {
                bio: reqBio,
                location: reqLoc
            });
        
        res.redirect('/registerAvatar?username=' + req.query.username);

    },
    postAvatar: async function (req, res){
        var filter = {username: req.query.username};
        var picEncoded = req.body.upload;

        if(picEncoded != null)
        {
            var pic = JSON.parse(picEncoded);
            if(pic != null && imageMimeTypes.includes(pic.type))
            {
                var dat = new Buffer.from(pic.data, 'base64');
                var dattype = pic.type;

                db.updateOne(User, filter, 
                    {
                        avatar: dat,
                        imgType: dattype
                    });
                res.redirect('/');
            }
            
        }
        else 
        {
            res.send(500 + "Error in handling data");
        }
    },
    getBioLoc: function(req, res){
        res.render('reg_landing',{layout: false});
    },
    getAvatar: function(req, res){
        res.render('reg_avatar',{layout: false});
    },
    deleteUser: async (req, res)=>{
        var currentUser = req.session.username;
        var projection = 'username';
        var query = {username: currentUser};

       
        db.deleteMany(Post, {user: currentUser});
        db.deleteMany(Comment, {user: currentUser});
        db.deleteMany(Likes, {user: currentUser});
        db.deleteMany(Following, {$or:[{user: currentUser}, {following:currentUser}]});
        db.deleteMany(Follower, {$or:[{user: currentUser}, {follower:currentUser}]});
        db.deleteOne(User, {username: currentUser});

        res.redirect('/');
    },
    getCheckUsername: (req, res)=>{
        var uname = req.query.username;

        db.findOne(User, {username: uname}, 'username', (result)=>{
            res.send(result);
        })
    },
    getCheckEmail: (req, res)=>{
        var mailer = req.query.email;

        db.findOne(User, {email: mailer}, 'email', (result)=>{
            res.send(result);
        })
    }
};

module.exports = registerController;