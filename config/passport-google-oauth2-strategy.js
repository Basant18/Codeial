const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const Users = require('../models/users');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "879199734289-v0s4c57amcdfmdtv9dkkgdae0h0llvkk.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, done){
        try
        {
            // find a user
            let user  = await Users.findOne({email: profile.emails[0].value});
            console.log(profile);
            if(user)
            {
                // if found, set this user as req.user
                return done(null,user);
            }
            else
            {
                // if not found, create the user and set it as req.user
                user = await Users.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });
                return done(null,user);
            }
        }
        catch(err)
        {
            console.log(err);
            return;
        }
    }
    
));

module.exports = passport;

