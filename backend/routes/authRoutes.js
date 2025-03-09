var express = require('express');
var passport = require('passport');
var router = express.Router();

// Triggering Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to the frontend with user data
    const user = req.user;
    res.redirect(`http://localhost:3000/auth/success?email=${user.email}&username=${user.username}&id=${user._id}`);
  });

// Triggering Facebook authentication
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook OAuth callback route
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to the frontend with user data
    const user = req.user;
    res.redirect(`http://localhost:3000/auth/success?email=${user.email}&username=${user.username}&id=${user._id}`);
  });

module.exports = router;