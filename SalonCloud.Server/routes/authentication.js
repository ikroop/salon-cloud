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