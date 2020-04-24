const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/User.js');

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

function tokenGenerator(){
    return Math.floor((Math.random() * 99999999) + 1000);
}


const forgotController = {
    sendEmail: async function(req,res){
        var reqEmail = req.query.email;
        var forgotToken = tokenGenerator();
        var exists = false;

        // send mail with defined transport object
        db.updateOne(User, {email: reqEmail}, {token: forgotToken});
        db.findOne(User, {email: reqEmail}, 'email', (result)=>{
            if(result != null){
                if(result.email == reqEmail){
                    exists = true;
                }
            }
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'foliodbteam@gmail.com',
                pass: 'accessingFOLIODB1'
            }
        });
        var info = await transporter.sendMail({
            from: '"Folio Team" <foliodbteam@gmail.com>', // sender address
            to: reqEmail, // list of receivers
            subject: "Forgot Your Folio Password?", // Subject line
            html: "If you've lost your password or want to reset it, click on the link for <br>localhost: <a href='http://localhost:3000/resetpassword?email="+reqEmail
            +"&token="+forgotToken+"'>For localhost</a><br>Heroku: <a href='http://foliodb.herokuapp.com/resetpassword?email="+ reqEmail +
            "&token="+forgotToken+"'>For Heroku</a><br> If you did not request a password reset, you can ignore this email."// plain text body
        }, function(err, info){
            if(!exists)
            {
                console.log(info);
                res.send("No such user.");
            }
            else{
                console.log(info);
                res.send("Email sent!");
            }
        });
    },

    resetPassword: async function(req, res){
        var reqToken = req.query.token;
        var reqEmail = req.query.email;

        res.render('reset', {layout: false, email: reqEmail, token: reqToken});
    },

    confResetPassword: async function(req, res){
        var newpass = req.body.newpass_;
        var reqEmail = req.body.email_;
        var reqToken = req.body.token_;

        console.log(newpass);
        console.log(reqEmail);
        console.log(reqToken);

        db.findOne(User, {email: reqEmail}, 'token', (result)=>{
            if(result != null)
            {
                if(reqToken == result.token)
                {
    
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(newpass, salt, async function(err, hash) {
                            // Store hash in your password DB.
                            var changeToken = tokenGenerator();
    
                            db.updateOne(User, {email: reqEmail}, {password: hash, token: changeToken});
                            res.render('login', {layout: false, errmsg: "Password changed!"});

                        });
                    });
                } else {
                    res.send(500);
                }
            } else {
                res.send(500);
            }

        });
        
    }
};

module.exports = forgotController;