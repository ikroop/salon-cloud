/*
 * GET users listing.
 */
"use strict";
const express_1 = require("express");
const authorization_1 = require("./authorization");
const authentication_1 = require('../core/authentication/authentication');
class AuthenticationRouter {
    constructor() {
        this.router = express_1.Router();
    }
    getRouter() {
        var authentication = new authentication_1.Authentication();
        var authorizationRouter = new authorization_1.AuthorizationRouter();
        this.router.post("/signupwithusernameandpassword", authorizationRouter.checkPermission, function (request, response) {
            authentication.signUpWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
                response.statusCode = code;
                if (err) {
                    response.json(err);
                }
                else if (data) {
                    response.json(data);
                }
            });
        });
        this.router.post("/signinwithusernameandpassword", authorizationRouter.checkPermission, function (request, response) {
            authentication.signInWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
                response.statusCode = code;
                if (err) {
                    response.json(err);
                }
                else if (data) {
                    response.json(data);
                }
            });
        });
        return this.router;
    }
}
exports.AuthenticationRouter = AuthenticationRouter;
//# sourceMappingURL=authentication.js.map