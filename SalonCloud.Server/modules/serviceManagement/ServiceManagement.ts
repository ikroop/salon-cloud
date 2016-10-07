/**
 * 
 * 
 * 
 */

import {ServiceManagementBehavior} from './ServiceManagementBehavior';
import {ServiceGroupData, ServiceItemData} from './ServiceData'
import {BaseValidator} from "./../../core/validation/BaseValidator";
import {MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId}
from "./../../core/validation/ValidationDecorators";
var ErrorMessage = require('./../../core/ErrorMessage');
import {SalonCloudResponse} from "../../core/SalonCloudResponse";
import {ServiceGroupModel, ServiceItemModel} from "./ServiceModel"

export class ServiceManagement implements ServiceManagementBehavior {
    private salonId: string;

    constructor($salonId: string) {
        this.salonId = $salonId;
    }

    /**
     * @name: addGroup
     * @parameter: 
     *     group: ServiceGroup
     * @return: group id OR ErrorMessage.
     * Add new service group to database
     */
    public async addGroup(group: ServiceGroupData) {
        var response: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var saveStatus;

        //Validate parameter
        var errorReturn = await this.validateServiceGroup(group);
        if (errorReturn) {
            response.code = 400;
            response.err = errorReturn;
            return response;
        }

        //Add new service group to database

        var dataCreation = ServiceGroupModel.create({
            description: group.description,
            name: group.name,
            service_list: group.service_list,
        })
        await dataCreation.then(function (docs) {
            response.data = docs._id;
            return;
        }, function (error) {
            response.err = error
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
        var returnResult: SalonCloudResponse<[ServiceGroupData]> = {
            err: undefined,
            code: undefined,
            data: undefined
        };
        var dailyDocsReturn = await ServiceGroupModel.findOne({ salonId: this.salonId }).exec(function (err, docs) {
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
        var returnResult: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var docsFound = await ServiceGroupModel.findOne({ salon_id: this.salonId, id: groupId }).exec();

        docsFound = group;
        var saveAction = docsFound.save();
        //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
        await saveAction.then(function (docs) {
            returnResult.data = true;
        }, function (err) {
            returnResult.err = err;
        })
        return returnResult;
    };

    /**
     * @name: validateServiceItem
     * @parameter: 
     *     item: ServiceItemData
     * @return: error message.
     * Validate Service Item.
     */
    private async validateServiceItem(item: ServiceItemData) {
        var errorReturn: any = undefined;

        //validate name field
        var serviceNameValidator = new BaseValidator(item.name);
        serviceNameValidator = new MissingCheck(serviceNameValidator, ErrorMessage.MissingScheduleCloseTime);
        var serviceNameResult = await serviceNameValidator.validate();
        if (serviceNameResult) {
            return errorReturn = serviceNameResult;
        }

        //validate price field
        var priceValidator = new BaseValidator(item.price);
        priceValidator = new MissingCheck(priceValidator, ErrorMessage.MissingScheduleCloseTime);
        priceValidator = new IsNumber(priceValidator, ErrorMessage.InvalidScheduleCloseTime);
        priceValidator = new IsInRange(priceValidator, ErrorMessage.InvalidScheduleCloseTime, 0, 1000);
        var priceResult = await priceValidator.validate();
        if (priceResult) {
            return errorReturn = priceResult;
        }

        //validate time field
        var timeValidator = new BaseValidator(item.time);
        timeValidator = new MissingCheck(timeValidator, ErrorMessage.MissingScheduleCloseTime);
        timeValidator = new IsNumber(timeValidator, ErrorMessage.InvalidScheduleCloseTime);
        timeValidator = new IsInRange(timeValidator, ErrorMessage.InvalidScheduleCloseTime, 0, 3600 * 5);
        var timeResult = await timeValidator.validate();
        if (timeResult) {
            return errorReturn = timeResult;
        }
        return errorReturn;
    }

    /**
     * @name: validateServiceGroup
     * @parameter: 
     *     group: ServiceGroupData
     * @return: error message.
     * Validate Service Group.
     */
    private async validateServiceGroup(group: ServiceGroupData) {
        var errorReturn: any = undefined;

        //validate name field
        var serviceNameValidator = new BaseValidator(group.name);
        serviceNameValidator = new MissingCheck(serviceNameValidator, ErrorMessage.MissingScheduleCloseTime);
        var serviceNameResult = await serviceNameValidator.validate();
        if (serviceNameResult) {
            return errorReturn = serviceNameResult;
        }

        //validate salon_id field
        var salonIdValidator = new BaseValidator(group.salon_id);
        salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingScheduleCloseTime);
        var priceResult = await salonIdValidator.validate();
        if (priceResult) {
            return errorReturn = priceResult;
        }

        //validate service item
        for (let item of group.service_list) {
            errorReturn = this.validateServiceItem(item)
            if (errorReturn) {
                return errorReturn;
            }
        }
        return errorReturn;
    }

}