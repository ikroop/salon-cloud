/*
 * GET users listing.
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
import fs = require('fs');
var ErrorMessage = require('./ErrorMessage');

var Authentication = require('../core/authentication/Authentication');
module route {
    export class AuthenticationRoute {
        public static SignUpWithEmailAndPassword(req: express.Request, res: express.Response) {
            //validate username;
            if (!req.body.username) {
                res.statusCode = 400;
                return res.json({
                    'err': {
                        'name': 'MissingUsername',
                        'message': 'A required username is missing!'
                    }
                });
            } else {
                var isPhonenumber = true;
                var isEmail = true;

                //case: username is phonenumber
                var phoneReg = /^\d{10}$/;
                if (!req.body.username.match(phoneReg)) {
                    isPhonenumber = false;
                }

                //case: username is email
                var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!req.body.username.match(emailReg)) {
                    isEmail = false;
                }

                if (!(isPhonenumber || isEmail)) {
                    res.statusCode = 400;
                    return res.json({
                        'err': {
                            'name': 'NotEmailOrPhoneNumber',
                            'message': 'A username must be a phone number or email'
                        }
                    });
                }

            }
            //validate password;
            if (!req.body.password) {
                res.statusCode = 400;
                return res.json({
                    'err': {
                        'name': 'MissingPassword',
                        'message': 'A required password is missing!'
                    }
                });
            } else {
                //validate password length, must be > = 6;
                if (req.body.password.length < 6) {
                    res.statusCode = 400;
                    return res.json({
                        'err': {
                            'name': 'PasswordTooShort',
                            'message': 'A password must be at least 6-character long!'
                        }
                    });
                }
            }
                        
            Authentication.register(new Authentication({ 
                'username': req.body.username,
                'status': true,
                'is_verified': false,
                'is_temporary': false
             }), 
                req.body.password, function (err, account) {
                if (err) {
                    res.statusCode = 409;
                    return res.json({ 'err': err });
                } else {
                    res.statusCode = 200;
                    return res.json({ 'user': account });
                }
            });
        }

        public static SignInWithEmailAndPassword(req: express.Request, res: express.Response, done) {
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

            Authentication.authenticate('local', { session: false })(req.body.username, req.body.password, function (err, user, options) {
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

                } else {
                    var created_at = new Date().getTime();
                    req.user = { username: user.username };
                    var cert = fs.readFileSync('./config/dev/private.key');  // get private key

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

        public static VerifyToken(req: express.Request, res: express.Response, next) {
            var token = req.headers.authorization;
            if (!token) {
                res.statusCode = 403;
                return res.json(ErrorMessage.InvalidTokenError);
            } else {
                var cert = fs.readFileSync('./config/dev/public.pem');  // get private key
                jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
                    if (err) {
                        res.statusCode = 403;
                        return res.json(ErrorMessage.InvalidTokenError);
                    } else {
                        req.user = payload;
                        next();
                    }
                });


            }
        }
    }
}
export = route.AuthenticationRoute;