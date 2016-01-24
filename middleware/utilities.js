module.exports.csrf = function(req,res,next){
	res.locals.token = req.csrfToken();
	next();
}