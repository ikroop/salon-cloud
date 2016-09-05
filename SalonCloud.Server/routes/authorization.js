/*
 * GET users listing.
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const express_1 = require("express");
const authorization_1 = require('../core/authorization/authorization');
class AuthorizationRouter {
    constructor() {
        this.router = express_1.Router();
        this.auth = new authorization_1.Authorization();
    }
    getRouter() {
        this.router.post("/signupwithusernameandpassword", (request, response) => __awaiter(this, void 0, void 0, function* () {
            this.auth.signUpWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
                response.statusCode = code;
                if (err) {
                    response.json(err);
                }
                else if (data) {
                    response.json(data);
                }
            });
        }));
        this.router.post("/signinwithusernameandpassword", (request, response) => __awaiter(this, void 0, void 0, function* () {
            var auth = new authorization_1.Authorization();
            this.auth.signInWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
                response.statusCode = code;
                if (err) {
                    response.json(err);
                }
                else if (data) {
                    response.json(data);
                }
            });
        }));
        return this.router;
    }
}
exports.AuthorizationRouter = AuthorizationRouter;
//# sourceMappingURL=authorization.js.map