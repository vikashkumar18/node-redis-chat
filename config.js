var config = {
  port: 3000,
  secret: 'secret',
  redisPort: 6379,
  redisHost: 'localhost',
  routes: {
    login: '/account/login',
    logout: '/account/logout',
    chat: '/chat',
    register: '/account/register',
    facebookAuth: '/auth/facebook',
    facebookAuthCallback: '/auth/facebook/callback',
    googleAuth: '/auth/google',
    googleAuthCallback: '/auth/google/callback'
  },
  host: 'http://localhost:3000',
  facebook: {
    appID: '182364318631927',
    appSecret: '8df470acd0ff17d40b8b1a3fd8a9daf1',
  },
  google: {
    clientID: '214969267854-lo4ap4ee3v83qigdgeksdnrp8gkb66bn.apps.googleusercontent.com',
    clientSecret: 'r8dl_12n9G0f81L1St_KHB7I'
  },
    /*Own authentication logic
      The keylen Integer is the size of our hash that comes back and randomSize is the size of the salt.
    */
    crypto: {
        workFactor: 5000,
        keylen: 32,
        randomSize: 256
    }
};
module.exports = config;
