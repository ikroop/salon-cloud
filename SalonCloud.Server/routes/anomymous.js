"use strict";
var ErrorMessage = require('./ErrorMessage');
const Authentication_1 = require('../core/user/Authentication');
const Anomymous_1 = require("./../core/user/Anomymous");
var route;
(function (route) {
    class AnomymousRoute {
        static signUpWithEmailAndPassword(req, res) {
            var anomymous = new Anomymous_1.Anomymous(new Authentication_1.Authentication());
            anomymous.signUp(req.body.username, req.body.password, function (err, code, data) {
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
        static signInWithEmailAndPassword(req, res, done) {
            var anomymous = new Anomymous_1.Anomymous(new Authentication_1.Authentication());
            anomymous.signIn(req.body.username, req.body.password, function (err, code, data) {
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
    }
    route.AnomymousRoute = AnomymousRoute;
})(route || (route = {}));
module.exports = route.AnomymousRoute;
//# sourceMappingURL=anomymous.js.map