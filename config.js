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
    facebookAuthCallback: '/auth/facebook/callback'
  },
  host: 'http://localhost:3000',
  facebook: {
    appID: '182364318631927',
    appSecret: '8df470acd0ff17d40b8b1a3fd8a9daf1',
  }
};
module.exports = config;
