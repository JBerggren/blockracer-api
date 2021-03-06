var jwt = require('jwt-simple');
var config = require('./config');

module.exports = function (req, res, next) {
	var token = req.headers['authorization'];
	if (token && token.indexOf("Bearer") != -1) {
		try {
			token = token.replace("Bearer ","");
			var userInfo = jwt.decode(token, config.jwtKey);
			if (!!userInfo.exp && userInfo.exp <= Date.now()) {
				res.end('Access token has expired', 400);
				return;				
			}
			req.user = userInfo;
			next();
		} catch (err) {
			res.end('Invalid token', 400);
		}
	} else {		
		res.end('Authentication required', 401);
	}
};