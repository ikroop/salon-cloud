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
        var salonId = request.body.salon_id || request.query.salon_id
        if (tokenStatus) { // authenticate successfully
            if (tokenStatus.code == 200) {
                var role = await authorization.checkPermission(tokenStatus.data._id, salonId, request.originalUrl)
                if (role.code === 200) {
                    request.user = tokenStatus.data;
                    request.user.role = role.data;
                    next();
                } else {
                    response.status(role.code);
                    response.json({ 'err': role.err });
                }

            } else {
                response.status(tokenStatus.code);
                response.json(tokenStatus.err);
            }
        } else { // anonymous
            var role = await authorization.checkPermission(null, request.body.salon_id, request.originalUrl);
            if (role.data) {
                next();
            } else {
                response.status(403);
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

