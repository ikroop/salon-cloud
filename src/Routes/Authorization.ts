/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */



import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { Authentication } from './../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';
import { RestfulResponseAdapter } from './../Core/RestfulResponseAdapter';

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
                    var restfulResponse = new RestfulResponseAdapter(role);
                    response.statusCode = 200;
                    response.json(restfulResponse.googleRestfulResponse());

                }

            } else {
                var restfulResponse = new RestfulResponseAdapter(tokenStatus);
                response.statusCode = 200;
                response.json(restfulResponse.googleRestfulResponse());
            }
        } else { // anonymous
            var role = await authorization.checkPermission(null, request.body.salon_id, request.originalUrl);
            if (role.data) {
                next();
            } else {
                var restfulResponse = new RestfulResponseAdapter(role);
                response.statusCode = 200;
                response.json(restfulResponse.googleRestfulResponse());
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

