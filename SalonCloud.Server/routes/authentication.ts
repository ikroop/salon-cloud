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