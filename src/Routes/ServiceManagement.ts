/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { Authentication } from './../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';
import { AuthorizationRouter } from './Authorization';
import { Owner } from './../Core/User/Owner'
import { SalonManagement } from './../Modules/SalonManagement/SalonManagement'
import { ServiceGroupData } from './../Modules/ServiceManagement/ServiceData';

export class ServiceManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post('/create', authorizationRouter.checkPermission, async function (request: Request, response: Response) {

            var ownerObject = new Owner(request.user._id, new SalonManagement(request.body.salon_id));

            // init and declare;
            var newServiceGroup: ServiceGroupData = {
                salon_id: request.body.salon_id,
                description: request.body.description || null,
                name: request.body.group_name,
                service_list: request.body.service_list || null
            }
            var creatingServiceAction = await ownerObject.addService(newServiceGroup);
            var returnData;
            if (creatingServiceAction.err) {
                returnData = {
                    'err': creatingServiceAction.err,
                }
            } else {
                returnData = {
                    'id': creatingServiceAction.data._id,
                }
            }

            response.status(creatingServiceAction.code).json(returnData);
        });
        return this.router;
    }
}

