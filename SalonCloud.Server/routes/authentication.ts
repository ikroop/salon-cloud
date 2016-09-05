/*
 * GET users listing.
 */


import { Router, Request, Response } from "express";
import { SalonCloudResponse } from "../core/SalonCloudResponse";
import { Authentication } from '../core/authentication/authentication';
import { Authorization } from "../core/authorization/authorization";
export class AuthenticationRouter {
    private router: Router = Router();
    private authentication: Authentication = new Authentication();
    private auhthorization: Authorization = new Authorization();

    public checkPermission(request: Request, response: Response, next) {
        var token = request.headers.authorization;

        this.auhthorization.verifyToken(token, function (err, code, data) {
            if (err) {
                response.statusCode = code;
                return response.json(err);
            } else {
                var UserId: string = request.user._id;
                var url: string = request.url;
                var permissionResponse: SalonCloudResponse<boolean> = this.authentication.checkPermission(UserId, url);
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
        });
    }

    getRouter(): Router {

        this.router.post("/checkpermission", function (request: Request, response: Response) {
            var UserId: string = request.user._id;
            var url: string = request.url;
            var permissionResponse: SalonCloudResponse<boolean> = this.authentication.checkPermission(UserId, url);
            response.statusCode = permissionResponse.code;
            if (permissionResponse.err) {
                response.json(permissionResponse.err);
            } else {
                response.json(permissionResponse.data);
            }
        });

        return this.router;
    }
}

