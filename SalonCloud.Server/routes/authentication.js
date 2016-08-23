"use strict";
var ErrorMessage = require('./ErrorMessage');
var AuthenticationModel = require('../core/authentication/AuthenticationModel');
const Authentication_1 = require('../core/authentication/Authentication');
var route;
(function (route) {
    class AuthenticationRoute {
        static signUpWithEmailAndPassword(req, res) {
            var authentication = new Authentication_1.Authentication();
            authentication.signUpWithEmailAndPassword(req.body.username, req.body.password, function (err, code, data) {
                if (err) {
                    res.statusCode = code;
                    return res.json(err);
                }
                else {
                    res.statusCode = code;
                    return res.json(data);
                }
            });
        }
        static signInWithEmailAndPassword(req, res, done) {
            var authentication = new Authentication_1.Authentication();
            authentication.signInWithEmailAndPassword(req.body.username, req.body.password, function (err, code, data) {
                if (err) {
                    res.statusCode = code;
                    return res.json(err);
                }
                else {
                    res.statusCode = code;
                    return res.json(data);
                }
            });
        }
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