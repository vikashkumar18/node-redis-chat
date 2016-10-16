var passport = require('passport'),
    facebook = require('passport-facebook').Strategy,
    //other variable declarations
    google = require('passport-google-oauth').OAuth2Strategy,
    config = require('../config');

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
*/
var routes = function routes(app){
  app.get(config.routes.facebookAuth, passport.authenticate('facebook'));
  app.get(config.routes.facebookAuthCallback, passport.authenticate('facebook', 
    {successRedirect: config.routes.chat, failureRedirect: config.routes.login, failureFlash: true}));
};

exports.passport = passport;
exports.routes = routes;
