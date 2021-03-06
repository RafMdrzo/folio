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
const nodemailer = require('nodemailer');

function tokenGenerator(){
    return Math.floor((Math.random() * 99999999) + 1000);
}

const registerController = {
    postRegister: async function(req, res){
        var reqName = req.body.fullName_;
        var reqUsername = req.body.userName_;
        var reqEmail = req.body.email_;
        var reqPw = req.body.pw_;
        var tokenGen = tokenGenerator();
        var temp = tokenGen;
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(reqPw, salt, async function(err, hash) {
                // Store hash in your password DB.
                db.insertOne(User,
                    {
                        fullName: reqName,
                        username : reqUsername,
                        email : reqEmail,
                        token: temp,
                        password : hash,
                        emailConf: false,
                        bio : "",
                        location : "",
                        avatar: null,
                        imgType: ""
                    }, (result)=>{
                        if(result == true){
                            console.log("Added " + 1);
                        } else {
                            console.log("Added " + 0);
                        }
                    });

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'foliodbteam@gmail.com',
                            pass: 'accessingFOLIODB1'
                        }
                    });
                    // send mail with defined transport object
                    var info = await transporter.sendMail({
                        from: '"Folio Team" <foliodbteam@gmail.com>', // sender address
                        to: reqEmail, // list of receivers
                        subject: "Welcome to Folio!", // Subject line
                        html: "Welcome to Folio!<br>This email serves as a confirmation for your email. If you're using localhost: <a href='http://localhost:3000/confirmuser?email="+reqEmail+
                                "&token="+tokenGen+"'> For localhost </a><br>or if you're using Heroku: <a href='http://foliodb.herokuapp.com/confirmuser?email="+reqEmail + "&token="+tokenGen+"'> For Heroku </a>." // plain text body
                    });
            });
        });
       
        

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

       
        db.deleteMany(Post, {user: currentUser}, (flag)=>{});
        db.deleteMany(Comment, {user: currentUser}, (flag)=>{});
        db.deleteMany(Likes, {user: currentUser}, (flag)=>{});
        db.deleteMany(Following, {$or:[{user: currentUser}, {following:currentUser}]}, (flag)=>{});
        db.deleteMany(Follower, {$or:[{user: currentUser}, {follower:currentUser}]}, (flag)=>{});
        db.deleteOne(User, {username: currentUser}, (flag)=>{});

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
    },
    getConfirmUser: async (req, res)=>{
        var reqEmail = req.query.email;
        var reqToken = req.query.token;

        db.findOne(User, {email: reqEmail}, 'token', (result)=>{
            if(result != null){
                if(result.token == reqToken){
                    var changeToken = tokenGenerator();
                    db.updateOne(User, {email: reqEmail}, {emailConf: true, token: changeToken});
                    db.findOne(User, {email: reqEmail}, 'avatar imgType', (newRes)=>{
                        res.render('confirmed', {
                            layout: false,
                            avatar: `data:${newRes.imgType};charset=utf-8;base64,${newRes.avatar.toString('base64')}`
                        });
            
                    });
                }
            } else {
                res.send(500)
            }
            
        })

       
    }
};

module.exports = registerController;