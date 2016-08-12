/*
 * GET users listing.
 */
import express = require('express');
import passport = require('passport');
import Authentication = require('../core/authentication/Authentication');

module route {
    export class AuthenticationRoute {
        public static register(req: express.Request, res: express.Response) {

            res.send("respond with a resource");
        };


        public static registerGet(req: express.Request, res: express.Response) {
            //res.render('register', {});
            res.json({ 'register': 'Test' });

        };

        public static registerPost(req: express.Request, res: express.Response) {
            //validate username;
            if (!req.body.username) {
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
                return res.json({
                    'err': {
                        'name': 'MissingPassword',
                        'message': 'A required password is missing!'
                    }
                });
            }
            Authentication.register(new Authentication({ username: req.body.username }), req.body.password, function (err, account) {
                if (err) {
                    return res.json({ 'err': err });
                } else {
                    return res.json({'account': account});
                }

                //passport.authenticate('local')(req, res, function () {
                //  res.redirect('/');
                //});
            });
        }
    }
}
export = route.AuthenticationRoute;