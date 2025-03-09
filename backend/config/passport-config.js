var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/userModel');  // Adjust the path as necessary

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ email: profile.emails[0].value }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        var newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value
        });
        newUser.save(function(err) {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
      } else {
        return done(null, user);
      }
    });
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3001/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    User.findOne({ email: userEmail }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user && userEmail) {
        var newUser = new User({
          username: profile.displayName,
          email: userEmail
        });
        newUser.save(function(err) {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
      } else {
        return done(null, user);
      }
    });
  }
));

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});