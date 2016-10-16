var passport = require('passport'),
    facebook = require('passport-facebook').Strategy,
    //other variable declarations
    google = require('passport-google-oauth').OAuth2Strategy,
    config = require('../config')
local = require('passport-local').Strategy,
    passwordUtils = require('./password'),
    user = require('./user');

passport.use(new facebook({
        clientID: config.facebook.appID,
        clientSecret: config.facebook.appSecret,
        callbackURL: config.host + config.routes.facebookAuthCallback
    },
    function(accessToken, refreshToken, profile, done) {
        /*
    The anonymous function is what Passport will run after a 
    successful authentication request. 
    For Facebook, this will involve some tokens, 
    a user profile object, and a callback. 
    */

        /*If we had a database, we could use it to check whether 
        that Facebook ID existed on a user,
         and then return that user or create a new user 
         if that Facebook ID was not used.
          Now, we need to build the functions that takes 
        the user in and out of the session. 
        This is what our done(null, profile) callback will call.*/

        //done is like next
        done(null, profile);
    }));
//right under the Facebook passport.use
passport.use(new google({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.host + config.routes.googleAuthCallback
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile);
    }));
/*
Passport 's local strategy requires us to build our own logic to determine if someone is authorized.
 If they are, Passport will take care of adding them to the session. 
 The first thing we do is check to see if a user exists; 
 if not, return with the message Wrong Username or Password. 
 Remember, you do not want to give attackers information, 
 such as whether or not a username is in use. Next, we use our passwordCheck function. 
 It will return a Boolean that states whether or not the password matched what was stored.
  Again, if it doesn'
t match, we will send our message back to the user.
If the password does match, we perform one last check to see whether 
the work factor is smaller than our config.
If so, update the salt, derived password, and work factor.
This allows us to update our work factor, and as users authenticate, 
we will store their password more securely.
*/
passport.use(new local(function(username, password, done) {
    user.findByUsername(username, function(err, profile) {
        if (profile) {
            passwordUtils.passwordCheck(password, profile.password, profile.salt, profile.work, function(err, isAuth) {
                if (isAuth) {
                    if (profile.work < config.crypto.workFactor) {
                        user.updatePassword(username, password, config.crypto.workFactor);
                    }
                    done(null, profile);
                } else {
                    done(null, false, { message: 'Wrong Username or Password' });
                }
            });
        } else {
            done(null, false, { message: 'Wrong Username or Password' });
        }
    });
}));

/*If we have our own database backend, 
  we can just store the user ID that we could 
  have looked up in the callback from the authentication method. 
  In this example, we are just storing the user object as is to the
  session.*/

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

/*
The first route is where we should send the initial Facebook 
authentication request. 
It will redirect the user to Facebook to approve the request.
 Facebook will then send the request back to our second route.
  This will finalize the authentication. 
  We can configure this middleware by passing in an options object
   as the second parameter.

For Google authentication
The main difference here is that our initial Google authentication URL
 has an extra object passed into it. This is the scope.
The scope tells Google what we want to access from the user.
Google then shows that to the user, so they can approve or deny the request.
*/
var routes = function routes(app) {
    app.get(config.routes.facebookAuth, passport.authenticate('facebook'));
    app.get(config.routes.facebookAuthCallback, passport.authenticate('facebook', { successRedirect: config.routes.chat, failureRedirect: config.routes.login, failureFlash: true }));
    app.get(config.routes.googleAuth, passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
    app.get(config.routes.googleAuthCallback, passport.authenticate('google', { successRedirect: config.routes.chat, failureRedirect: config.routes.login, failureFlash: true }));
    app.post(config.routes.login, passport.authenticate('local', { successRedirect: '/chat', failureRedirect: config.routes.login, failureFlash: true }));
};

exports.passport = passport;
exports.routes = routes;
