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
session = require('express-session');
var RedisStore = require('connect-redis')(session);
var app = express();
app.set("views","./app_views");
var routes = require('./routes');
var errorHandlers = require('./middleware/errorhandelers');
var log = require('./middleware/logs');
//tell express what is the views engine
app.set("view engine","jade");
app.use(log.logger);
app.use(express.static(__dirname + '/static'));
app.use(cookieParser(config.secret));
//app.use(session({secret: 'secret'}));
app.use(session({
  secret: config.secret,
  saveUninitialized: true,
  resave: true,
  store: new RedisStore(
   {url: config.redisUrl})
  })
  );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(csurf());
app.use(util.csrf);
app.use(util.authenticated);

app.use(function(req, res, next){
  if(req.session.pageCount)
    req.session.pageCount++;
  else
    req.session.pageCount = 1;
  console.log("pagecount: "+req.session.pageCount);
  next();
});

app.use(flash());
app.use(util.templateRoutes);

app.get('/',routes.index);
app.get(config.routes.login,routes.login);
app.post(config.routes.login,routes.loginProcess);
app.get(config.routes.logout, routes.logout);
//the middleware will be used only for /chat route
app.get('/chat', [util.requireAuthentication], routes.chat);

//route is just another middle ware
app.get('/error', function(req, res, next){
  next(new Error('A contrived error'));
});

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

app.listen(config.port);
console.log("App server running on port 3000");