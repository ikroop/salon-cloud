/*
 * GET users listing.
 */

import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { Authentication } from './../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';
import { AuthorizationRouter } from './Authorization';
import { Owner } from './../Core/User/Owner'
import {SalonManagement} from './../Modules/SalonManagement/SalonManagement'

export class ServiceManagementRouter {
    private router: Router = Router();    

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();
       
        this.router.post('/create', authorizationRouter.checkPermission ,async function (request: Request, response: Response) {
            

            var ownerObject = new Owner(request.user._id, new SalonManagement(request.body.salon_id));
            var creatingServiceAction:any = await ownerObject.addService(request.body);
            var returnData;
            if(creatingServiceAction.err){
                returnData = {
                    'err': creatingServiceAction.err,
                } 
            }else{
                returnData = {
                'id' : creatingServiceAction.data._id,
                }
            }

            response.status(creatingServiceAction.code).json(returnData);
            


        });
        return this.router;
    }
}

