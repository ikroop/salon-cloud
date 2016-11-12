/*
 * GET users listing.
 */


import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { Authentication } from './../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';

export class AuthorizationRouter {
    private router: Router = Router();

    /**
     * checkPermission
     * 
     * @param {Request} request
     * @param {Response} response
     * @param {any} next
     * 
     * @memberOf AuthorizationRouter
     */
    public async checkPermission(request: Request, response: Response, next) {
        var token = request.headers['authorization'];
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
        var tokenStatus: any = await authentication.verifyToken(token);
        if (tokenStatus) {
            if (tokenStatus.code = 200) {
                // FIX ME: call check Permission in Authorization class
                request.user = tokenStatus.data;

                next();
            } else {
                response.statusCode = tokenStatus.code;
                response.json(tokenStatus.err);
            }
        } else {
            // FIX ME: call check Permission in Authorization class
            next();
        }
    }

    getRouter(): Router {
        var auhthorization = new Authorization();

        this.router.post('/allowpermission', function (request: Request, response: Response) {

        });
        this.router.post('/disallowpermission', function (request: Request, response: Response) {

        });
        return this.router;
    }
}

