const Users = require('../models/users');

const user = function(req,res){
    return res.redirect('/users/profile',{
        title: 'Users'
    });
}

const profile = function(req, res){
    return res.render('user_profile',{
        title: 'Users'
    });
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
    return res.redirect('/users/profile');
}

const destroySession = function(req, res){
    req.logout(err => {
        if(err){
            console.log(err);
            return;
        }
        return res.redirect('/users/profile');
    });
}

module.exports = {user, profile, profileUserId, signUp, signIn, create, createSession, destroySession};