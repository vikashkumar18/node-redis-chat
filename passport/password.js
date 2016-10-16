var crypto = require('crypto'),
    scmp = require('scmp'),
    config = require('../config');
/*
passwordCreate function takes a password and will create a secure hash.
The function first uses randomBytes that will return 256 random bytes of data. 
The 256 bytes of data is based on our config setting.
 We then take that as salt and the clear text password and send it to 
 Password-Based Key Derivation Function 2 (PBKDF2), 
 which is a function that will create a derived key based on salt, 
 our password, and a work factor.
  We then return salt and the derived key back so that we can store it somewhere
*/

var passwordCreate = function passwordCreate(password, cb){
  crypto.randomBytes(config.crypto.randomSize, function(err, salt){
    if (err)
      return cb(err, null);
        crypto.pbkdf2(password, salt.toString('base64'), config.crypto.workFactor, config.crypto.keylen, function(err, key){
            cb(null, salt.toString('base64'), key.toString('base64'));
        });
    });
};
/*
The passwordCheck function will do the opposite of that. It will take a password, 
a derived password, a work factor, and salt, and rerun the hashing function.
 Then, it will compare the values using scmp. 
 If they match, then the password was correct, and if not, it was not a valid password.
*/
var passwordCheck = function passwordCheck(password, derivedPassword, salt, work, cb){
    crypto.pbkdf2(password, salt, work, config.crypto.keylen, function(err, key){
        cb(null, scmp(key.toString('base64'), derivedPassword));
    });
};

exports.passwordCreate = passwordCreate;
exports.passwordCheck = passwordCheck;