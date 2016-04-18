/*
This will be where we initialize Socket.IO and wire up all our event 
listeners and emitters. We are just going to use one namespace 
for our application. If we were to add multiple namespaces, 
I would just add them as files underneath the socket.io directory
*/

var io = require('socket.io');
var config = require('../config');
var cookie = require('cookie');
//cookie-parser is used to parse signed cookie
var cookieParser = require('cookie-parser');

//at the top with the other variable declarations
var expressSession = require('express-session');
// we mentioned that connect-redis extends the default session store object of Express
var ConnectRedis = require('connect-redis')(expressSession);
var redisSession = new ConnectRedis({host: config.redisHost, port: config.redisPort});

/*An application state is a flexible idea.
 We can store the application state locally. 
 This is done when the state does not need to be shared. 
 A simple example is keeping the path to a local temp file.
  When the data will be needed by multiple connections,
   then it must be put into a shared space. 
   Anything with a user's session will need to be shared, 
   for example.*/
var redisAdapter = require('socket.io-redis');










var socketAuth = function socketAuth(socket, next) {
    var handshakeData = socket.request;
    var parsedCookie = cookie.parse(handshakeData.headers.cookie);
    var sid = cookieParser.signedCookie(parsedCookie['connect.sid'],config.secret);

    if (parsedCookie['connect.sid'] === sid){
        return next(new Error('Not Authenticated'));
    }

    redisSession.get(sid,function(err,session){
        if(session.isAuthenticated){
            socket.user = session.user;
            socket.sid = sid;
            console.log("we came here");
            return next();
        }else{
            console.log("we came in error");
            return next(new Error('Not Authenticated!'));
        }
    });
    //return next(new Error('Nothing Defined'));
};

var socketConnection = function socketConnection(socket){
  socket.on('GetMe', function(){});
  socket.on('GetUser', function(room){});
  socket.on('GetChat', function(data){});
  socket.on('AddChat', function(chat){});
  socket.on('GetRoom', function(){});
  socket.on('AddRoom', function(r){});
  socket.on('disconnect', function(){});
};

exports.startIo = function startIo(server) {
    io = io.listen(server);
    io.adapter(redisAdapter({host: config.redisHost, port: config.redisPort}));
    //Next, we get a reference to our namespace and listen on the connection event, 
    //sending a message event back to the client
    var packtchat = io.of(config.routes.chat);
    packtchat.use(socketAuth);
    packtchat.on('connection', socketConnection);

    return io;
};
