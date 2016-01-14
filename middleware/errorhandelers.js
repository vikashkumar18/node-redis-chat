/*
Define error-handling middleware functions in the same way 
as other middleware functions, except error-handling 
functions have four arguments instead of three: 
(err, req, res, next). 
You define error-handling middleware last, after other app.use() and routes calls

*/

module.exports.notFound = function notFound( req, res, next) {
   // console.log("error-handelingMW::" + err.stack);
    res.status(404).send('You seem lost. You must have taken a wrong turn back there.');
};
