var util = require('../middleware/utilities'),
    config = require('../config'),
    //variable declaration
    user = require('../passport/user');
//exports
module.exports.register = register;
module.exports.registerProcess = registerProcess;;
module.exports.index = index;
module.exports.login = login;
module.exports.loginProcess = loginProcess;
module.exports.chat = chat;
module.exports.logout = logout;

function index(req, res) {
    res.cookie('IndexCookie', 'This was set from server');
    res.render('index', {
        title: "Index",
        cookie: JSON.stringify(req.cookies),
        session: JSON.stringify(req.session),
        signedCookie: JSON.stringify(req.signedCookies)
    });
};

/*
The flash message is now in the session. To display this, we just have to get it out. The act of getting it out will also delete it from the session
*/
function login(req, res) {
    res.render('login', { title: 'Login', message: req.flash('error') });
};

//not needed as local authentication is taken care by passport
// function loginProcess(req, res) {
//     var isAuth = util.auth(req.body.username, req.body.password, req.session);
//     if (isAuth) {
//         res.redirect("/chat");
//     } else {
//         req.flash('error', 'Wrong Username or Password');
//         res.redirect(config.routes.login);
//     }
// };

function chat(req, res) {
    res.render('chat', {
        title: "Chat"
    });
};

function logout(req, res) {
    util.logOut(req);
    res.redirect('/');
}

function register(req, res){
  res.render('register', {title: 'Register', message: req.flash('error')});
};

function register Process (req, res){
  if (req.body.username && req.body.password)
  {
    user.addUser(req.body.username, req.body.password, config.crypto.workFactor, function(err, profile){
      if (err) {
        req.flash('error', err);
        res.redirect(config.routes.register);
      }else{
        req.login(profile, function(err){
          res.redirect('/chat');
        });
      }
    });
  }else{
    req.flash('error', 'Please fill out all the fields');
    res.redirect(config.routes.register);
  }
};
