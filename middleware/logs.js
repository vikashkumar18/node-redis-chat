/*
Define error-handling middleware functions in the same way 
as other middleware functions, except error-handling 
functions have four arguments instead of three: 
(err, req, res, next). 
You define error-handling middleware last, after other app.use() and routes calls

*/

exports.logger = function logger(req, res, next){
  console.log(req.url);
  next();
};
