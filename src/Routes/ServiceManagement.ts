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
import { ServiceManagement } from './../Modules/ServiceManagement/ServiceManagement';
import { RestfulResponseAdapter } from './../Core/RestfulResponseAdapter';

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
            console.log('creatingServiceAction: %j', creatingServiceAction);
            var restfulResponse = new RestfulResponseAdapter(creatingServiceAction);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });

        this.router.get('/getall', async function (request: Request, response: Response) {
            let salonId = request.query.salon_id;
            var serviceManegement = new ServiceManagement(salonId);
            var services = await serviceManegement.getServices();
            var restfulResponse = new RestfulResponseAdapter(services);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });

        return this.router;
    }
}

