/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ServiceManagementBehavior } from './ServiceManagementBehavior';
import { ServiceGroupData, ServiceItemData, IServiceGroupData, IServiceItemData } from './ServiceData'
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidNameString, IsServiceGroupNameExisted }
    from './../../Core/Validation/ValidationDecorators';
import { ErrorMessage } from './../../Core/ErrorMessage';
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { ServiceManagementDatabaseInterface } from './../../Services/ServiceDatabase/ServiceManagementDatabaseInterface'
import { FirebaseServiceManagement } from './../../Services/ServiceDatabase/Firebase/FirebaseServiceManagement';

export class ServiceManagement implements ServiceManagementBehavior {
    private salonId: string;
    private serviceDatabase: ServiceManagementDatabaseInterface<IServiceGroupData, IServiceItemData>
    constructor($salonId: string) {
        this.salonId = $salonId;
        this.serviceDatabase = new FirebaseServiceManagement(this.salonId);
    }

    /**
     * 
     * 
     * @param {[ServiceGroupData]} groupArray
     * @returns
     * 
     * @memberOf ServiceManagement
     */
    public async addGroupArray(groupArray: [ServiceGroupData]) {
        var returnResult: SalonCloudResponse<[ServiceGroupData]> = {
            code: null,
            data: null,
            err: null
        };
        var saveGroupArray: [ServiceGroupData];
        for (let group of groupArray) {
            var addResult = await this.addGroup(group);
            if (addResult.err) {
                returnResult.err = addResult.err;
                returnResult.code = 500;
            } else {
                saveGroupArray.push(addResult.data);
            }
        }
        if (!returnResult.err) {

            returnResult.data = groupArray;
            returnResult.code = 200;
        }
        return returnResult;
    }

    /**
     * @name: addGroup
     * @parameter: 
     *     group: ServiceGroup
     * @return: group id OR ErrorMessage.
     * Add new service group to database
     */
    public async addGroup(group: ServiceGroupData): Promise<SalonCloudResponse<IServiceGroupData>> {
        var response: SalonCloudResponse<IServiceGroupData> = {
            code: null,
            data: null,
            err: null
        };
        var saveStatus;
        //Add new service group to database
        var validations = await this.validateServiceGroup(group);
        if (validations.err) {
            response.err = validations.err;
            response.code = validations.code;
            return response;
        }

        var serviceGroupInput: ServiceGroupData = {
            description: group.description,
            name: group.name,
            salon_id: group.salon_id,
            service_list: group.service_list
        }
        try {
            var serviceGroup = await this.serviceDatabase.createGroup(serviceGroupInput);
            response.data = serviceGroup;
            response.code = 200;
        } catch (error) {
            response.err = error;
            response.code = 500;
        }

        return response;

    };

    /**
     * @name: getServices
     * @parameter: 
     *     None
     * @return: all service groups
     * Get all service groups and services.
     */
    public async getServices() {
        var returnResult: SalonCloudResponse<IServiceGroupData[]> = {
            err: null,
            code: null,
            data: null
        };

        var salonIdValidation = new BaseValidator(this.salonId);
        salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId.err);
        salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound.err);
        var salonIdError = await salonIdValidation.validate();

        if (salonIdError) {
            returnResult.err = salonIdError;
            returnResult.code = 400; //Bad Request
            return returnResult;
        }

        try {
            var rs = await this.serviceDatabase.getAllServices();
            returnResult.data = rs;
            returnResult.code = 200;
        } catch (error) {
            returnResult.err = error;
            returnResult.code = 500;
        }
        return returnResult;
    };

    /**
     * @name: updateGroup
     * @parameter: 
     *     groupId: service group
     *     group: data will be updated
     * @return: boolean OR ErrorMessage
     * Update all data in service group by new service group data.
     */
    public async updateGroup(groupId: string, group: ServiceGroupData) {
        /*var returnResult: SalonCloudResponse<boolean> = {
            code: null,
            data: null,
            err: null
        };
        var docsFound = await ServiceGroupModel.find({ salon_id: this.salonId, id: groupId }).exec();

        docsFound = group;
        var saveAction = docsFound.save();
        //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
        await saveAction.then(function (docs) {
            returnResult.data = true;
        }, function (err) {
            returnResult.err = err;
        })
        return returnResult;*/
    };

    /**
     * @name: validateServiceItem
     * @parameter: 
     *     item: ServiceItemData
     * @return: error message.
     * Validate Service Item.
     */
    private async validateServiceItem(item: ServiceItemData): Promise<SalonCloudResponse<null>> {
        var returnResult: SalonCloudResponse<any> = {
            code: null,
            data: null,
            err: null
        };
        //validate name field
        var serviceNameValidator = new BaseValidator(item.name);
        serviceNameValidator = new MissingCheck(serviceNameValidator, ErrorMessage.MissingServiceName.err);
        serviceNameValidator = new IsValidNameString(serviceNameValidator, ErrorMessage.InvalidNameString.err);
        var serviceNameResult = await serviceNameValidator.validate();
        if (serviceNameResult) {
            returnResult.err = serviceNameResult;
            returnResult.code = 400;
            return returnResult;
        }

        //validate price field
        var priceValidator = new BaseValidator(item.price);
        priceValidator = new MissingCheck(priceValidator, ErrorMessage.MissingServicePrice.err);
        priceValidator = new IsNumber(priceValidator, ErrorMessage.ServicePriceRangeError.err);
        priceValidator = new IsInRange(priceValidator, ErrorMessage.ServicePriceRangeError.err, 0, 500);
        var priceResult = await priceValidator.validate();
        if (priceResult) {
            returnResult.err = priceResult;
            returnResult.code = 400;
            return returnResult;
        }

        //validate time field
        var timeValidator = new BaseValidator(item.time);
        timeValidator = new MissingCheck(timeValidator, ErrorMessage.MissingServiceTime.err);
        timeValidator = new IsNumber(timeValidator, ErrorMessage.InvalidServiceTime.err);
        timeValidator = new IsInRange(timeValidator, ErrorMessage.InvalidServiceTime.err, 300, 3600 * 3);
        var timeResult = await timeValidator.validate();
        if (timeResult) {
            returnResult.err = timeResult;
            returnResult.code = 400;
            return returnResult;
        }
        return returnResult;
    }

    /**
     * @name: validateServiceGroup
     * @parameter: 
     *     group: ServiceGroupData
     * @return: error message.
     * Validate Service Group.
     */
    public async validateServiceGroup(group: ServiceGroupData): Promise<SalonCloudResponse<null>> {
        var returnResult: SalonCloudResponse<any> = {
            code: null,
            data: null,
            err: null
        };
        // validate salon_id field
        var salonIdValidator = new BaseValidator(group.salon_id);
        salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId.err);
        salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.SalonNotFound.err);
        var priceResult = await salonIdValidator.validate();
        if (priceResult) {
            returnResult.err = priceResult;
            returnResult.code = 400;
            return returnResult;
        }

        // validate name field
        var serviceNameValidator = new BaseValidator(group.name);
        serviceNameValidator = new MissingCheck(serviceNameValidator, ErrorMessage.MissingGroupName.err);
        serviceNameValidator = new IsValidNameString(serviceNameValidator, ErrorMessage.InvalidNameString.err);
        serviceNameValidator = new IsServiceGroupNameExisted(serviceNameValidator, ErrorMessage.ServiceGroupNameExisted.err, group.salon_id);
        var serviceNameResult = await serviceNameValidator.validate();
        if (serviceNameResult) {
            returnResult.err = serviceNameResult;
            returnResult.code = 400;
            return returnResult;
        }

        // validate description field 
        var descriptionValidator = new BaseValidator(group.description);
        descriptionValidator = new MissingCheck(descriptionValidator, ErrorMessage.MissingDescription.err);
        descriptionValidator = new IsValidNameString(descriptionValidator, ErrorMessage.InvalidDescriptionString.err);
        var descriptionError = await descriptionValidator.validate();
        if (descriptionError) {
            returnResult.err = descriptionError;
            returnResult.code = 400;
            return returnResult;
        }

        // validate service item
        if (group.service_list) {
            for (let item of group.service_list) {
                returnResult = await this.validateServiceItem(item)
                if (returnResult.err) {
                    return returnResult;
                }
            }
        }
        return returnResult;
    }


    /**
     * 
     * 
     * @param {string} serviceId
     * @returns {Promise<SalonCloudResponse<ServiceItemData>>}
     * 
     * @memberOf ServiceManagement
     */
    public async getServiceItemById(serviceId: string): Promise<SalonCloudResponse<IServiceItemData>> {
        var response: SalonCloudResponse<IServiceItemData> = {
            data: null,
            code: null,
            err: null
        }
        try {
            var rs = await this.serviceDatabase.getServiceItemById(serviceId);
            response.code = 200;
            response.data = rs;
        } catch (error) {
            response.code = 500;
            response.err = error;
        }
        return response;
    }

    /**
     * 
     * 
     * @param {string} groupName
     * @returns {Promise<SalonCloudResponse<IServiceGroupData>>}
     * 
     * @memberOf ServiceManagement
     */
    public async getServiceGroupByName(groupName: string): Promise<SalonCloudResponse<IServiceGroupData>> {

        var response: SalonCloudResponse<IServiceGroupData> = {
            data: null,
            code: null,
            err: null
        }
        try {
            var rs = await this.serviceDatabase.getServiceGroupByName(groupName);
            response.code = 200;
            response.data = rs;
        } catch (error) {
            response.code = 500;
            response.err = error;
        }
        return response;
    }

}