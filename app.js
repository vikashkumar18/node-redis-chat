var express = require('express'),
    //with all the other requires at the top of the file
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    csurf = require('csurf'),
    flash = require('connect-flash'),
    //to use all config varibles
    //first step towards modular approach
    config = require('./config'),
    util = require('./middleware/utilities'),
    session = require('express-session'),
    io = require('./socket.io');
var RedisStore = require('connect-redis')(session),

    passport = require('./passport');




var app = express();
app.set("views", "./app_views");
var routes = require('./routes');
var errorHandlers = require('./middleware/errorhandelers');
var log = require('./middleware/logs');
//tell express what is the views engine
app.set("view engine", "jade");
app.use(log.logger);
/*I learned that if you add the session middleware 
before your static directory,
 Express will generate sessions for requests on static files like stylesheets, images, and JavaScript.

*/
app.use(express.static(__dirname + '/static'));
app.use(cookieParser(config.secret));
//app.use(session({secret: 'secret'}));
app.use(session({
    secret: config.secret,
    saveUninitialized: true,
    resave: true,
    store: new RedisStore({host: config.redisHost, port: config.redisPort})
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//passport initialization
/* We will need to put Passport's session middleware 
after Express' session middleware. 
This is because Passport extends Express' session.*/
app.use(passport.passport.initialize());
app.use(passport.passport.session());

app.use(csurf());
app.use(util.csrf);
app.use(util.authenticated);

app.use(function(req, res, next) {
    if (req.session.pageCount)
        req.session.pageCount++;
    else
        req.session.pageCount = 1;
    console.log("pagecount: " + req.session.pageCount);
    next();
});

app.use(flash());
app.use(util.templateRoutes);

passport.routes(app);
app.get('/', routes.index);
app.get(config.routes.login, routes.login);
app.post(config.routes.login, routes.loginProcess);
app.get(config.routes.logout, routes.logout);
//the middleware will be used only for /chat route
app.get(config.routes.chat, [util.requireAuthentication], routes.chat);

//route is just another middle ware
app.get('/error', function(req, res, next) {
    next(new Error('A contrived error'));
});

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);


/*
Socket.IO listens using Node's http.createServer. 
It does this automatically if you pass in a number into its 
listen function. 

When Express executes app.listen, it returns an instance 
of the HTTP server. We capture that, and now we can pass 
the http server to Socket.IO's listen function. 

*/
var server = app.listen(config.port);
io.startIo(server);

//app.listen(config.port);
console.log("App server running on port 3000");
