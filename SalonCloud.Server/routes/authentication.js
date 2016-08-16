"use strict";
const jwt = require('jsonwebtoken');
var Authentication = require('../core/authentication/Authentication');
var route;
(function (route) {
    class AuthenticationRoute {
        static SignUpWithEmailAndPassword(req, res) {
            //validate username;
            console.log('tset');
            if (!req.body.username) {
                res.statusCode = 400;
                return res.json({
                    'err': {
                        'name': 'MissingUsername',
                        'message': 'A required username is missing!'
                    }
                });
            }
            else {
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
            }
            else {
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
            //validate fullname;
            if (!req.body.fullname) {
                res.statusCode = 400;
                return res.json({
                    'err': {
                        'name': 'MissingFullname',
                        'message': 'A fullname is required for registration!'
                    }
                });
            }
            Authentication.register(new Authentication({ username: req.body.username }), req.body.password, function (err, account) {
                if (err) {
                    res.statusCode = 409;
                    return res.json({ 'err': err });
                }
                else {
                    res.statusCode = 200;
                    return res.json({ 'user': account });
                }
                //passport.authenticate('local')(req, res, function () {
                //  res.redirect('/');
                //});
            });
        }
        static SignInWithEmailAndPassword(req, res, done) {
            console.log('preLogin');
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
                }
                else {
                    console.log(user);
                    req.user = { id: user.id };
                    var token = jwt.sign({
                        id: user._id,
                    }, 'server secret', {
                        expiresIn: 120
                    });
                    //req.login(user, function (err) {
                    //   res.send({
                    //      success: true,
                    //      user: user
                    //  });
                    //});
                    res.status(200).json({
                        user: req.user,
                        token: token
                    });
                }
            });
            console.log('login succeed');
        }
    }
    route.AuthenticationRoute = AuthenticationRoute;
})(route || (route = {}));
module.exports = route.AuthenticationRoute;
//# sourceMappingURL=authentication.js.map