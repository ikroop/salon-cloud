/**
 * 
 * 
 * 
 */

import { ServiceManagementBehavior } from './ServiceManagementBehavior';
import { ServiceGroupData, ServiceItemData, IServiceGroupData, IServiceItemData } from './ServiceData'
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId, IsValidNameString, IsServiceGroupNameExisted }
    from './../../Core/Validation/ValidationDecorators';
import { ErrorMessage } from './../../Core/ErrorMessage';
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import ServiceGroupModel = require('./ServiceModel');

export class ServiceManagement implements ServiceManagementBehavior {
    private salonId: string;

    constructor($salonId: string) {
        this.salonId = $salonId;
    }

    /** 
     * 
     * 
    */

    public async addGroupArray(groupArray: [ServiceGroupData]) {
        var returnResult: SalonCloudResponse<[ServiceGroupData]> = {
            code: undefined,
            data: undefined,
            err: undefined
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
            code: undefined,
            data: undefined,
            err: undefined
        };
        var saveStatus;
        //Add new service group to database
        var validations = await this.validateServiceGroup(group);
        if (validations.err){
            response.err = validations.err;
            response.code = validations.code;
            return response;
        }
        var dataCreation = ServiceGroupModel.create(group)
        await dataCreation.then(function (docs: IServiceGroupData) {
            response.data = docs;
            response.code = 200;
            return;
        }, function (error) {
            response.err = error
            response.code = 500;
            return;
        })

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
            err: undefined,
            code: undefined,
            data: undefined
        };
        console.log('salon_id:', this.salonId);
        await ServiceGroupModel.find({ salon_id: this.salonId }).exec(function (err, docs: [IServiceGroupData]) {
            if (err) {
                returnResult.err = err;
            } else {
                if (!docs) {
                    returnResult.data = undefined;
                } else {
                    returnResult.data = docs;
                }
            }
        });
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
            code: undefined,
            data: undefined,
            err: undefined
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
    private async validateServiceItem(item: ServiceItemData): Promise<SalonCloudResponse<undefined>> {
        var returnResult: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        //validate name field
        var serviceNameValidator = new BaseValidator(item.name);
        serviceNameValidator = new MissingCheck(serviceNameValidator, ErrorMessage.MissingServiceName);
        serviceNameValidator = new IsValidNameString(serviceNameValidator, ErrorMessage.InvalidNameString);
        var serviceNameResult = await serviceNameValidator.validate();
        if (serviceNameResult) {
            returnResult.err = serviceNameResult.err;
            returnResult.code = 400;
            return returnResult;
        }

        //validate price field
        var priceValidator = new BaseValidator(item.price);
        priceValidator = new MissingCheck(priceValidator, ErrorMessage.MissingServicePrice);
        priceValidator = new IsNumber(priceValidator, ErrorMessage.ServicePriceRangeError);
        priceValidator = new IsInRange(priceValidator, ErrorMessage.ServicePriceRangeError, 0, 500);
        var priceResult = await priceValidator.validate();
        if (priceResult) {
            returnResult.err = priceResult.err;
            returnResult.code = 400;
            return returnResult;
        }

        //validate time field
        var timeValidator = new BaseValidator(item.time);
        timeValidator = new MissingCheck(timeValidator, ErrorMessage.MissingServiceTime);
        timeValidator = new IsNumber(timeValidator, ErrorMessage.InvalidServiceTime);
        timeValidator = new IsInRange(timeValidator, ErrorMessage.InvalidServiceTime, 300, 3600 * 3);
        var timeResult = await timeValidator.validate();
        if (timeResult) {
            returnResult.err = timeResult.err;
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
    public async validateServiceGroup(group: ServiceGroupData): Promise<SalonCloudResponse<undefined>> {
        var returnResult: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        // validate salon_id field
        var salonIdValidator = new BaseValidator(group.salon_id);
        salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId);
        salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.SalonNotFound);
        var priceResult = await salonIdValidator.validate();
        if (priceResult) {
            returnResult.err = priceResult.err;
            returnResult.code = 400;
            return returnResult;
        }

        // validate name field
        var serviceNameValidator = new BaseValidator(group.name);
        serviceNameValidator = new MissingCheck(serviceNameValidator, ErrorMessage.MissingGroupName);
        serviceNameValidator = new IsValidNameString(serviceNameValidator, ErrorMessage.InvalidNameString);
        serviceNameValidator = new IsServiceGroupNameExisted(serviceNameValidator, ErrorMessage.ServiceGroupNameExisted, group.salon_id);
        var serviceNameResult = await serviceNameValidator.validate();
        if (serviceNameResult) {
            returnResult.err = serviceNameResult.err;
            returnResult.code = 400;
            return returnResult;
        }

        // validate description field 
        var descriptionValidator = new BaseValidator(group.description);
        descriptionValidator = new MissingCheck(descriptionValidator, ErrorMessage.MissingDescription);
        descriptionValidator = new IsValidNameString(descriptionValidator, ErrorMessage.InvalidDescriptionString);
        var descriptionError = await descriptionValidator.validate();
        if (descriptionError) {
            returnResult.err = descriptionError.err;
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
            data: undefined,
            code: undefined,
            err: undefined
        }
        console.log('SERVICEID: ',serviceId);
        var serviceSearch = await ServiceGroupModel.findOne({ 'service_list': { '$elemMatch': { '_id': serviceId } } }).exec(function (err, docs: IServiceItemData) {
            if (err) {
                console.log('1');
                response.code = 500;
                response.err = err;
            } else if (!docs) {
                console.log('2');
                response.code = 200;
                response.data = undefined;
            } else {
                console.log('3');
                response.code = 200;
                response.data = docs;
                console.log('DOcs:', docs);
                console.log('Response: ',response);
            }
        });

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
            data: undefined,
            code: undefined,
            err: undefined
        }

        await ServiceGroupModel.findOne({ 'name': groupName, 'salon_id': this.salonId }).exec(function (err, docs: IServiceGroupData) {
            if (err) {
                response.err = err;
            } else if (!docs) {
                response.data = undefined;
            } else {
                response.data = docs;
            }
        });

        return response;
    }

}