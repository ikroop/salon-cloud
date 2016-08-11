/*
 * GET users listing.
 */
import express = require('express');
import passport = require('passport');
import Account = require('../Core/Authentication/Authentication');

module route {
    export class Authentication {
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
                return {
                    'err': {
                        'name': 'MissingUsername',
                        'message': 'A required username is missing!'
                    }
                };
            } else{
                var phonePatt = /^\d{10}$/;
                if (!req.body.username.match(phonePatt)) {
                    return {
                        'err': {
                            'name': 'NotAPhonenumber',
                            'message': 'A username must be a phone number'
                        }
                    };
                }

            }
            //validate password;
            if (!req.body.password) {
                return {
                    'err': {
                        'name': 'MissingPassword',
                        'message': 'A required password is missing!'
                    }
                };
            }
            //validate email;
            if (req.body.email) {
                
            }
            Account.register(new Account({ username: req.body.username }), req.body.password, function (err, account) {
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
export = route;