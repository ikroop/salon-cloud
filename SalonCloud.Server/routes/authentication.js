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
            if (!req.body.username) {
                res.statusCode = 400;
                return res.json({
                    'err': {
                        'name': 'MissingUsername',
                        'message': 'Username is required to login'
                    }
                });
            }
            if (!req.body.password) {
                res.statusCode = 400;
                return res.json({
                    'err': {
                        'name': 'MissingPassword',
                        'message': 'Password is required to login'
                    }
                });
            }
            AuthenticationModel.authenticate('local', { session: false })(req.body.username, req.body.password, function (err, user, options) {
                if (err) {
                    return done(err);
                }
                if (user === false) {
                    res.statusCode = 403;
                    return res.json({
                        'err': {
                            'name': 'SignInFailed',
                            'message': options.message
                        }
                    });
                }
                else {
                    var created_at = new Date().getTime();
                    req.user = { username: user.username };
                    var cert = fs.readFileSync('./config/dev/private.key'); // get private key
                    var token = jwt.sign({
                        'id': user._id,
                        'created_at': created_at
                    }, cert, { algorithm: 'RS256' });
                    res.statusCode = 200;
                    return res.json({
                        user: req.user,
                        auth: {
                            token: token
                        }
                    });
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