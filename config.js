var config = {
  port: 3000,
  secret: 'secret',
  redisPort: 6379,
  redisHost: 'localhost',
  routes: {
    login: '/account/login',
    logout: '/account/logout',
    chat: '/chat',
    facebookAuth: '/auth/facebook',
    facebookAuthCallback: '/auth/facebook/callback',
    googleAuth: '/auth/google',
    googleAuthCallback: '/auth/google/callback'
  },
  host: 'http://localhost:3000',
  facebook: {
    appID: '',
    appSecret: '',
  },
  google: {
    clientID: '',
    clientSecret: ''
  }
};
module.exports = config;
