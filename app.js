var express = require('express'),
//with all the other requires at the top of the file
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
csurf = require('csurf'),
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
app.use(cookieParser("secret"));
//app.use(session({secret: 'secret'}));
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  store: new RedisStore(
    {host:"127.0.0.1",port:"6379"})
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(csurf());
app.use(util.csrf);

app.use(function(req, res, next){
  if(req.session.pageCount)
    req.session.pageCount++;
  else
    req.session.pageCount = 1;
  console.log("pagecount: "+req.session.pageCount);
  next();
});

app.get('/',routes.index);
app.get('/login',routes.login);
app.post('/login',routes.loginProcess);
app.get('/chat',routes.chat);

//route is just another middle ware
app.get('/error', function(req, res, next){
  next(new Error('A contrived error'));
});

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

app.listen(3000);
console.log("App server running on port 3000");