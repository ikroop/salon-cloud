/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Router, Request, Response } from 'express';
import { AuthorizationRouter } from './Authorization';
import { Authentication } from './../Core/Authentication/Authentication';
import { SignedInUser } from './../Core/User/SignedInUser';
import { SalonManagement } from './../Modules/SalonManagement/SalonManagement';
import { UserManagement } from './../Modules/UserManagement/UserManagement';
import { SalonInformation } from './../Modules/SalonManagement/SalonData'
import { EmployeeManagement } from './../Modules/UserManagement/EmployeeManagement';
import { RestfulResponseAdapter } from './../Core/RestfulResponseAdapter';
import { Owner } from './../Core/User/Owner';

export class SalonManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();
        this.router.post('/test', async (request: Request, response: Response) => {

            var testObj = new EmployeeManagement('57faa2692579df79216a153c');
            await testObj.getAllEmployee();
        })
        this.router.post('/create', authorizationRouter.checkPermission, async (request: Request, response: Response) => {
            var signedUser = new SignedInUser(request.user._id, new SalonManagement(null));//Todo
            var salonInformationInput: SalonInformation = {
                email: request.body.email || null,
                phone: {
                    number: request.body.phonenumber || null,
                    is_verified: false
                },
                location: {
                    address: request.body.address || null,
                    is_verified: false,
                    timezone_id: null
                },
                salon_name: request.body.salon_name || null,
            }

            var salonCreation = await signedUser.createSalon(salonInformationInput);
            var restfulResponse = new RestfulResponseAdapter(salonCreation);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });

        this.router.get('/getsalonlist', authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            var userId = request.user._id;
            var signedInUser = new SignedInUser(userId, new SalonManagement(null));
            var getSalonListResponse = await signedInUser.getSalonList();
            var restfulResponse = new RestfulResponseAdapter(getSalonListResponse);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());

        });

        this.router.get('/getinformation', async function (request: Request, response: Response) {
            let salonId = request.query.salon_id;
            var salonManagement = new SalonManagement(salonId);
            var salonProfile = await salonManagement.getSalonById();
            var dataReturn;

            if (salonProfile.code === 200) {
                var SalonInformation = salonProfile.data.information;
                dataReturn = {
                    'name': SalonInformation.salon_name,
                    'phone': SalonInformation.phone.number,
                    'location': SalonInformation.location.address,
                    'email': SalonInformation.email
                }

                salonProfile.data = dataReturn;
            }

            var restfulResponse = new RestfulResponseAdapter(salonProfile);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });

        this.router.post('/getsettings', authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            let salonId = request.body.salon_id;
            let userId = request.user._id;

            var owner = new Owner(userId, new SalonManagement(salonId));
            var salonSettings = await owner.getSalonSettings(salonId);

            var restfulResponse = new RestfulResponseAdapter(salonSettings);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });

        this.router.post('/updatesettings', authorizationRouter.checkPermission, function (request: Request, response: Response) {

        });

        this.router.post('/updateinformation', authorizationRouter.checkPermission, async function (request: Request, response: Response) {

            var owner = new Owner(request.user._id, new SalonManagement(request.body.salon_id));

            var salonInformationInput: SalonInformation = {
                email: request.body.email || null,
                phone: {
                    number: request.body.phonenumber || null,
                    is_verified: false
                },
                location: {
                    address: request.body.address || null,
                    is_verified: false,
                    timezone_id: null
                },
                salon_name: request.body.salon_name || null,
            }

            var result = await owner.updateSalonInformation(salonInformationInput);
            var restfulResponse = new RestfulResponseAdapter(result);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });

        return this.router;

    }
}