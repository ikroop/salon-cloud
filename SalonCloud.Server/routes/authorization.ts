/*
 * GET users listing.
 */


import { Router, Request, Response } from "express";
import { SalonCloudResponse } from "../core/SalonCloudResponse";
import { Authentication } from '../core/authentication/authentication';
import { Authorization } from "../core/authorization/authorization";
export class AuthorizationRouter {
    private router: Router = Router();

    public checkPermission(request: Request, response: Response, next) {
        var token = request.headers["authorization"];
        var authentication = new Authentication();
        var authorization = new Authorization();
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
        authentication.verifyToken(token, function (err, code, data) {
            request.user = data;
            next();
        });
    }

    getRouter(): Router {
        var auhthorization = new Authorization();

        this.router.post("/allowpermission", function (request: Request, response: Response) {

        });
        this.router.post("/disallowpermission", function (request: Request, response: Response) {

        });
        return this.router;
    }
}

