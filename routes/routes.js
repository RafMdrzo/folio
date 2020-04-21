const express = require('express');
//for session checking
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const assert = require('assert');
const filepond = require('filepond');
const bcrypt = require('bcryptjs');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const loginController = require('../controllers/loginController.js');
const registerController = require('../controllers/registerController.js');
const postController = require('../controllers/postController.js');
const profileController = require('../controllers/profileController.js');
const searchController = require('../controllers/searchController.js');
const commentController = require('../controllers/commentController.js');
const likeController = require('../controllers/likeController.js');
const followController = require('../controllers/followController.js');

app.use(session({
  cookieName:'session',
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//login
app.get("/",loginController.getLogIn);

app.post('/home', loginController.postLogIn);
app.post('/register', registerController.postRegister);

//registration
app.get('/registerBioLoc', registerController.getBioLoc);
app.get('/registerAvatar', registerController.getAvatar)

app.post('/registerBioLoc', registerController.postBioLoc);
app.post('/registerAvatar', registerController.postAvatar);

//posting
app.post('/postprocessing', postController.postAddPost);
app.get('/home', postController.getHome);
//edit post
app.post('/editprocessing', postController.postEditPost);
//delete post
app.post('/deletepost', postController.postDeletePost);

//commenting
app.post('/addcomment', commentController.postAddComment);

//liking
app.post('/likepost', likeController.postLike);
app.post('/unlikepost', likeController.deleteLike);

//following
app.post('/following', followController.follow);
app.post('/unfollowing', followController.unfollow);

//editprofile
app.post('/editprofile', profileController.postEditProfile);

//editemail
app.post('/editemail', profileController.postEditEmail);

//changepassword
app.post('/changepassword', profileController.postChangePassword);

app.get('/search', searchController.getSearch);
//delete user
app.post('/deleteuser', registerController.deleteUser);


//register ajax
app.get('/checkUsername', registerController.getCheckUsername);
app.get('/checkEmail', registerController.getCheckEmail);

//logout
app.get('/logout', function(req, res) {
  req.session.destroy((err) => {

    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

app.get("/profile", profileController.getSelfProfile);
app.get("/:username", profileController.getUserProfile);


module.exports = app;
