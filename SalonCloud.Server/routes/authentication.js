"use strict";
const Account = require('../Core/Authentication/Authentication');
var route;
(function (route) {
    class Authentication {
        static register(req, res) {
            res.send("respond with a resource");
        }
        ;
        static registerGet(req, res) {
            //res.render('register', {});
            res.json({ 'register': 'Test' });
        }
        ;
        static registerPost(req, res) {
            //validate username;
            if (!req.body.username) {
                return {
                    'err': {
                        'name': 'MissingUsername',
                        'message': 'A required username is missing!'
                    }
                };
            }
            else {
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
                }
                else {
                    return res.json({ 'account': account });
                }
                //passport.authenticate('local')(req, res, function () {
                //  res.redirect('/');
                //});
            });
        }
    }
    route.Authentication = Authentication;
})(route || (route = {}));
module.exports = route;
//# sourceMappingURL=authentication.js.map