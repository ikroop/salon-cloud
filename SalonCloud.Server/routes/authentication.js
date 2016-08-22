"use strict";
const jwt = require('jsonwebtoken');
const fs = require('fs');
var ErrorMessage = require('./ErrorMessage');
var AuthenticationModel = require('../core/authentication/AuthenticationModel');
const Authentication_1 = require('../core/authentication/Authentication');
var route;
(function (route) {
    class AuthenticationRoute {
        static SignUpWithEmailAndPassword(req, res) {
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
        static SignInWithEmailAndPassword(req, res, done) {
            var authentication = new Authentication_1.Authentication();
            authentication.SignInWithEmailAndPassword(req.body.username, req.body.password, function (err, code, data) {
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
        static VerifyToken(req, res, next) {
            var token = req.headers.authorization;
            if (!token) {
                res.statusCode = 403;
                return res.json(ErrorMessage.InvalidTokenError);
            }
            else {
                var cert = fs.readFileSync('./config/dev/public.pem'); // get private key
                jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
                    if (err) {
                        res.statusCode = 403;
                        return res.json(ErrorMessage.InvalidTokenError);
                    }
                    else {
                        req.user = payload;
                        next();
                    }
                });
            }
        }
    }
    route.AuthenticationRoute = AuthenticationRoute;
})(route || (route = {}));
module.exports = route.AuthenticationRoute;
//# sourceMappingURL=authentication.js.map