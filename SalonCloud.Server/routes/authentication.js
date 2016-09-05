/*
 * GET users listing.
 */
"use strict";
const express_1 = require("express");
const authentication_1 = require('../core/authentication/authentication');
const authorization_1 = require("../core/authorization/authorization");
class AuthenticationRouter {
    constructor() {
        this.router = express_1.Router();
        this.authentication = new authentication_1.Authentication();
        this.auhthorization = new authorization_1.Authorization();
    }
    checkPermission(request, response, next) {
        var token = request.headers.authorization;
        this.auhthorization.verifyToken(token, function (err, code, data) {
            if (err) {
                response.statusCode = code;
                return response.json(err);
            }
            else {
                var UserId = request.user._id;
                var url = request.url;
                var permissionResponse = this.authentication.checkPermission(UserId, url);
                response.statusCode = permissionResponse.code;
                if (permissionResponse.err) {
                    response.statusCode = permissionResponse.code;
                    response.json(permissionResponse.err);
                }
                else if (permissionResponse.data) {
                    next();
                }
                else {
                    response.statusCode = permissionResponse.code;
                    response.json(permissionResponse.data);
                }
            }
        });
    }
    getRouter() {
        this.router.post("/checkpermission", function (request, response) {
            var UserId = request.user._id;
            var url = request.url;
            var permissionResponse = this.authentication.checkPermission(UserId, url);
            response.statusCode = permissionResponse.code;
            if (permissionResponse.err) {
                response.json(permissionResponse.err);
            }
            else {
                response.json(permissionResponse.data);
            }
        });
        return this.router;
    }
}
exports.AuthenticationRouter = AuthenticationRouter;
//# sourceMappingURL=authentication.js.map