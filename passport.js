var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({_id: id}, function (err, user) {
    done(err, user);
  })
});

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function (username, password, done) {
    User.findOne({email: username}, function (err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username or password'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect username or password'
        });
      }

      return done(null, user);
    })
  }
));

passport.use(new GoogleStrategy({
      clientID: '502472303125-c2535tb9j8s1m26ht2e0ld54j94j40bt.apps.googleusercontent.com',
      clientSecret: 'FHD4Pa2YURhUURo8Ndi0G4P0',
      callbackURL: 'https://live-code-editor.herokuapp.com/auth/google/callback'
    },
    function(token, refreshToken, profile, done) {
    User.findOne({'google.id': profile.id}, function(err, user) {
      if (err) return done(err);

      if (user) {
        return done(null, user);
      } else {
        User.findOne({email: profile.emails[0].value}, function (err, user) {
          if (user) {
            user.googleId = profile.id
            return user.save(function (err) {
              if (err) return done(null, false, { message: "Can't save user info"});
              return done(null, user);
            })
          }

          var user = new User();
          user.name = profile.displayName;
          user.email = profile.emails[0].value;
          user.googleId = profile.id
          user.save(function (err) {
            if (err) return done(null, false, { message: "Can't save user info"});
            return done(null, user);
          });
        })
      }


    });
  }
));