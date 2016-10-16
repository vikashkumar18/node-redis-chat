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
        appID: '',
        appSecret: '',
    },
    google: {
        clientID: '',
        clientSecret: ''
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
