const Users = require('../models/users');
const fs = require('fs');
const path = require('path');
const Token = require('../models/token');
const crypto = require('crypto');
const resetPasswordMailer = require('../mailers/reset_password_mailer');

const user = function(req,res){
    return res.redirect('/users/profile',{
        title: 'Users'
    });
}

const profile = async function(req, res){
    try{
        let user = await Users.findById(req.params.id);
        console.log(user);
        return res.render('user_profile',{
            title: 'Users',
            profile_user: user
        });
    }
    catch(err)
    {
        console.log(err);
        return;
    }
}

const update = async function(req, res){
    if(req.user.id == req.params.id){
        try
        {
            let user = await Users.findById(req.params.id, req.body);
            Users.uploadedAvatar(req, res, function(err){
                if(err)
                {
                    console.log('*****Multer Error: ',err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file)
                {
                    if(user.avatar && fs.existsSync(path.join(__dirname,'..',user.avatar)))
                    {
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = Users.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err)
        {
            req.flash('error', err);
            return res.redirect('back');
        }
    }
    else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

const profileUserId = function(req, res){
    const userId = req.params.userID;
    res.end('<h1>User ID => '+ userId +'</h1>'); 
}

//render the sign up page
const signUp = function(req, res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title: 'Codeial | Sign In'
    });
}

//render the sign in page
const signIn = function(req, res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: 'Codeial | Sign Up'
    });
}

const create = async function(req, res){
    let user = undefined;
    if(req.body.password !== req.body.confirm_password)
    {
        console.log('Password different');
        console.log(req.body.password);
        console.log(req.body.confirm_password);
        return res.redirect('back');
    }
    try
    {
        user = await Users.findOne({email: req.body.email});
        console.log(user);
    }
    catch(err)
    {
        console.log('error in finding user in signup');
        return;
    }
    if(!user)
    {
        try
        {
            await Users.create(req.body)
        }
        catch(err)
        {
            console.log('error in creating user while signup');
            return;
        }
        return res.redirect('/users/sign-in');
    }
    return res.redirect('back');
}

const createSession = function(req, res){
    req.flash('success',"LoggedIn Successfully");
    return res.redirect('/home');
}

const destroySession = function(req, res){
    req.flash('success',"You have logged out!");
    req.logout(err => {
        if(err){
            console.log(err);
            return;
        }
        return res.redirect('/users/sign-in');
    });
}

const emailVerify = function(req,res){
    return res.render('email_verify',{
        title: 'Codeial | Verify Email for Reset Password'
    });
}

const resetPassword = async function(req, res){
    try
    {
        let user = await Users.findOne({email: req.body.email});
        if(!user)
        {
            console.log('EmailId doesnot exist');
            return;
        }
        let token = await Token.create({
            user: user._id,
            accessToken: crypto.randomBytes(32).toString("hex"),
            isValid: true
        });
        resetPasswordMailer.resetPassword(token);
        return res.redirect('back');
    }
    catch(err)
    {
        console.log(err);
        return res.redirect('back');
    }
}

const resetPasswordForm = function(req,res){
    console.log(req.params['accessToken']);
    return res.render('reset_password_form',{
        title: 'Codeial | Reset Password',
        accessToken: req.params.accessToken
    });
}

const createNewPassword = async function(req, res){
    const accessToken = req.params.accessToken;
    console.log(accessToken);
    if(req.body.password != req.body.confirm_password)
    {
        console.log('Wrong Password! Create new password');
        return;
    }
    try
    {
        let token = await Token.findOne({accessToken : accessToken});
        console.log('Token',token);
        let user = await Users.findById({_id:token.user});
        console.log(user);
        user.password = req.body.password;
        await user.save();
        await token.deleteOne();
        return res.redirect('/users/sign-in');
    }
    catch(err)
    {
        console.log(err);
        return;
    }
}

module.exports = {user, profile, update, profileUserId, signUp, signIn, create, createSession, destroySession, emailVerify, resetPassword, resetPasswordForm, createNewPassword};