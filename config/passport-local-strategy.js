const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new LocalStrategy({
    usernameField: 'email',
   },
   async function(email, password, done){
    let user;
    try{
        user = await User.findOne({email: email});
    }
    catch(err)
    {
        console.log('Error in finding user ---> passport');
        return done(err);
    }
    if(!user || user.password != password)
    {
        console.log('Invalid Username/Password');
        return done(null, false);
    }
    return done(null, user);
   }
));

// serailizing the user to decide which key to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserailzing the user from the key in the cookies
passport.deserializeUser(async function(id,done){
    let user;
    try{
        user = await User.findById(id)
    }
    catch(err)
    {
        console.log('Error in finding user ---> passport');
        return done(err);
    }
    return done(null, user);
});

// check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated())
    {
        return next();
    }
    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated())
    {
        // req.user contains the current signed in user from the session cookie and we are just sending this to locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;