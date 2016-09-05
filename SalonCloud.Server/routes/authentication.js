"use strict";
var ErrorMessage = require('./ErrorMessage');
const Authentication_1 = require('../core/user/Authentication');
var route;
(function (route) {
    class AuthenticationRoute {
        /**
         * Check access TOKEN in Request
         * Push user(id, iat, ...) to req.user
         */
        static verifyToken(req, res, next) {
            var token = req.headers.authorization;
            var authentication = new Authentication_1.Authentication();
            authentication.verifyToken(token, function (err, code, data) {
                if (err) {
                    res.statusCode = code;
                    return res.json(err);
                }
                else {
                    req.user = data;
                    next();
                }
            });
        }
    }
    route.AuthenticationRoute = AuthenticationRoute;
})(route || (route = {}));
module.exports = route.AuthenticationRoute;
//# sourceMappingURL=authentication.js.map