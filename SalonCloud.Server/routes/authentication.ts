/*
 * GET users listing.
 */
import express = require('express');
import passport = require('passport');
import Authentication = require('../core/authentication/Authentication');


module route {
    export class AuthenticationRoute {
        public static SignUpWithEmailAndPassword(req: express.Request, res: express.Response) {
            console.log('sus1');
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
            console.log('sus2');

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
            console.log('sus');
            Authentication.register(new Authentication({ username: req.body.username }), req.body.password, function (err, account) {
                if (err) {
                    console.log('err: %j', err);
                    console.log('err');
                    res.statusCode = 409;
                    return res.json({ 'err': err });
                } else {
                    console.log('sus');
                    res.statusCode = 200;
                    return res.json({ 'user': account });
                }

                //passport.authenticate('local')(req, res, function () {
                //  res.redirect('/');
                //});
            });
        }
    }
}
export = route.AuthenticationRoute;