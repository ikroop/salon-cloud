/*
 * GET users listing.
 */
"use strict";
const express_1 = require("express");
const authentication_1 = require("./authentication");
const authorization_1 = require('../core/authorization/authorization');
class AuthorizationRouter {
    constructor() {
        this.router = express_1.Router();
        this.authorization = new authorization_1.Authorization();
        this.authenticationRouter = new authentication_1.AuthenticationRouter();
    }
    getRouter() {
        this.router.post("/signupwithusernameandpassword", this.authenticationRouter.checkPermission, function (request, response) {
            this.authorization.signUpWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
                response.statusCode = code;
                if (err) {
                    response.json(err);
                }
                else if (data) {
                    response.json(data);
                }
            });
        });
        this.router.post("/signinwithusernameandpassword", this.authenticationRouter.checkPermission, function (request, response) {
            var auth = new authorization_1.Authorization();
            this.authorization.signInWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
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
exports.AuthorizationRouter = AuthorizationRouter;
//# sourceMappingURL=authorization.js.map