const express = require('express');
const router = express.Router();
const passport = require('passport'); 

const usersController = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication, usersController.profile);

// router.get('/profile/:id', usersController.profileUserId);
// router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id',passport.checkAuthentication, usersController.update);

router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);
router.post('/create', usersController.create);
// use passport as a middleware to authenticate 
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: 'sign-in'}
),usersController.createSession);

router.get('/sign-out',usersController.destroySession);
router.get('/auth/google', passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google',{failureRedirect: 'users/sign-in'}), usersController.createSession);
router.get('/email-verify',usersController.emailVerify);
router.post('/reset-password',usersController.resetPassword);
router.get('/reset-password/:accessToken',usersController.resetPasswordForm);
router.post('/create-new-password/:accessToken',usersController.createNewPassword);

module.exports = router;