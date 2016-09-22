/*
 * GET users listing.
 */
"use strict";
const express_1 = require("express");
const authentication_1 = require('../core/authentication/authentication');
const authorization_1 = require("../core/authorization/authorization");
class AuthorizationRouter {
    constructor() {
        this.router = express_1.Router();
    }
    checkPermission(request, response, next) {
        var token = request.headers.authorization;
        var authentication = new authentication_1.Authentication();
        var authorization = new authorization_1.Authorization();
        /*authentication.verifyToken(token, function (err, code, data) {
            if (err) {
                response.statusCode = code;
                return response.json(err);
            } else {
                var UserId: string = request.user._id;
                var url: string = request.url;
                var permissionResponse: SalonCloudResponse<boolean> = authorization.checkPermission(UserId, url);
                response.statusCode = permissionResponse.code;
                if (permissionResponse.err) {
                    response.statusCode = permissionResponse.code;
                    response.json(permissionResponse.err);
                } else if (permissionResponse.data){
                    next();
                } else {
                    response.statusCode = permissionResponse.code;
                    response.json(permissionResponse.data);
                }
            }
        });*/
        next();
    }
    getRouter() {
        var auhthorization = new authorization_1.Authorization();
        this.router.post("/checkpermission", function (request, response) {
            /*var UserId: string = request.user._id;
            var url: string = request.url;
            var permissionResponse: SalonCloudResponse<boolean> = auhthorization.checkPermission(UserId, url);
            response.statusCode = permissionResponse.code;
            if (permissionResponse.err) {
                response.json(permissionResponse.err);
            } else {
                response.json(permissionResponse.data);
                next();
            }*/
            console.log("request.body:", request.body);
        });
        return this.router;
    }
}
exports.AuthorizationRouter = AuthorizationRouter;
//# sourceMappingURL=authorization.js.map