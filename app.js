var express = require('express'),
//with all the other requires at the top of the file
cookieParser = require('cookie-parser'),
session = require('express-session');
var app = express();
app.set("views","./app_views");
var routes = require('./routes');
var errorHandlers = require('./middleware/errorhandelers');
var log = require('./middleware/logs');
//tell express what is the views engine
app.set("view engine","jade");
app.use(log.logger);
app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use(session({secret: 'secret'}));

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