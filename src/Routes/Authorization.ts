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
     * @method checkPermission
     * @description check User Permission
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
        var tokenStatus: any = await authentication.verifyToken(token);
        if (tokenStatus) { // authenticate successfully
            if (tokenStatus.code == 200) {
                var role = await authorization.checkPermission(tokenStatus.data._id, request.body.salon_id, request.originalUrl)
                if (role.code === 200) {
                    request.user = tokenStatus.data;
                    request.user.role = role.data;
                    next();
                } else {
                    response.statusCode = role.code;
                    response.json({ 'err': role.err });
                }

            } else {
                response.statusCode = tokenStatus.code;
                response.json(tokenStatus.err);
            }
        } else { // anonymous
            var role = await authorization.checkPermission(undefined, request.body.salon_id, request.originalUrl);
            if (role.data) {
                next();
            } else {
                response.statusCode = 403;
                response.json();
            }
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

