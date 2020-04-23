const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/User.js');

const nodemailer = require('nodemailer');

const forgotController = {
    sendEmail: async function(req,res){
        var reqEmail = req.query.email;
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
            subject: "Forgot Your Folio Password?", // Subject line
            html: "If you've lost your password or want to reset it, click on the  <a href='http://localhost:3000/resetpass?email="+reqEmail+"'>link</a>"+
                  "<br>If you did not request a password reset, you can ignore this email." // plain text body
        }, function(err, info){
            if(err)
                console.log(err);
            else
                console.log(info);
        });
        res.send(reqEmail);
    },

    resetPassword: async function(req, res){
        res.render('reset', {layout: false});
    },

    confResetPassword: async function(req, res){
        var newpass = req.body.pw_;
        var confnewpass = req.body.cp_w;
        var reqEmail = req.query.email;
        
        if((newpass != "") && (confnewpass != "") && (newpass == confnewpass))
        {
            db.updateOne(User, {email: reqEmail}, {password: confnewpass});
        }

        res.render('login');
    }
};

module.exports = forgotController;