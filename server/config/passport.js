// server/config/passport.js
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');
const keys = require('./keys');

module.exports = function (passport) {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: keys.twitter.consumerKey,
        consumerSecret: keys.twitter.consumerSecret,
        callbackURL: keys.twitter.callbackURL,
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        try {
          let user = await User.findOne({ twitterId: profile.id });
          if (user) {
            user.token = token;
            user.tokenSecret = tokenSecret;
            await user.save();
            return done(null, user);
          } else {
            const newUser = new User({
              twitterId: profile.id,
              username: profile.username,
              displayName: profile.displayName,
              token,
              tokenSecret,
            });
            await newUser.save();
            return done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
