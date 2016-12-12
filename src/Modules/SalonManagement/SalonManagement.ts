/**
 * 
 * 
 * 
 */
import { SalonManagementBehavior } from './SalonManagementBehavior'
import { ISalonData, SalonData, SalonInformation, SalonSetting } from './SalonData'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import SalonModel = require('./SalonModel');
import { defaultSalonSetting } from './../../Core/DefaultData'
import { BaseValidator } from './../../Core/Validation/BaseValidator'
import { MissingCheck, IsPhoneNumber, IsEmail, IsString } from './../../Core/Validation/ValidationDecorators'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { GoogleMap } from './../../Core/GoogleMap/GoogleMap';

export class SalonManagement implements SalonManagementBehavior {

    salonId: string;

    constructor(salonId: string) {
        this.salonId = salonId;
    }

    public activate(): SalonCloudResponse<boolean> {
        return;
    };

    public createInformation(salonId: string, data: SalonInformation): SalonCloudResponse<string> {
        return;
    };

    /**
     * 
     * 
     * @param {SalonInformation} salonInformation
     * @returns
     * 
     * @memberOf SalonManagement
     */
    public async createSalonDocs(salonInformation: SalonInformation) {

        var returnResult: SalonCloudResponse<ISalonData> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var salonData: SalonData = {
            information: salonInformation,
            setting: defaultSalonSetting,
        }

        var validations = await this.validation(salonInformation);
        console.log('validations:', validations);
        if (validations.err){
            returnResult.err = validations.err;
            returnResult.code = validations.code;
        }
         // get Timezone from address and puts that into salon information constructor
        // TODO:
        var Timezone: any = await GoogleMap.getTimeZone(salonInformation.location.address);
        salonInformation.location.timezone_id = Timezone['timeZoneId'];

        // create Salon record
        var salon = new SalonModel(salonData);
        var SalonCreation = salon.save();
        await SalonCreation.then(function (docs) {
            returnResult.data = docs;
        }, function (err) {
            returnResult.err = err;
        })

        return returnResult;
    };

    public createSetting(salonId: string, setting: SalonSetting): SalonCloudResponse<boolean> {
        return;
    };

    public deactivate(): SalonCloudResponse<boolean> {
        return;
    };

    public getAllSalon(userId: string): SalonCloudResponse<SalonInformation> {
        return;
    };

    public updateInformation(data: SalonInformation): SalonCloudResponse<boolean> {
        return;
    };

    public updateSetting(setting: SalonSetting): SalonCloudResponse<boolean> {
        return;
    };
    
    /**
     * 
     * 
     * @returns {Promise<number>}
     * 
     * @memberOf SalonManagement
     */
    public getFlexibleTime(): Promise<number> {
        let salonId = this.salonId;
        let promise = new Promise<any>(function (resolve, reject) {
            var flexibleTime = 0;
            SalonModel.findOne({ '_id': salonId }, function (err, docs: ISalonData) {
                if (err) {
                    flexibleTime = 0;
                } else if (!docs) {
                    flexibleTime = 0;
                } else {
                    flexibleTime = docs.setting.flexible_time;
                }
                resolve(flexibleTime);
            });
        });
        return promise;
    }

    /**
     * 
     * 
     * @param {SalonInformation} salonInformation
     * @returns
     * 
     * @memberOf SalonManagement
     */
    public async validation(salonInformation: SalonInformation) {
        var returnResult: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        // Validation
        // salon name validation
        console.log('salonInformation:', salonInformation);
        var salonNameValidator = new BaseValidator(salonInformation.salon_name);
        salonNameValidator = new MissingCheck(salonNameValidator, ErrorMessage.MissingSalonName);
        var salonNameError = await salonNameValidator.validate();
        if (salonNameError) {
            returnResult.err = salonNameError;
            returnResult.code = 400;
            return returnResult;
        }
        // address validation 
        var addressValidator = new BaseValidator(salonInformation.location.address);
        addressValidator = new MissingCheck(addressValidator, ErrorMessage.MissingAddress);
        // TODO: validator for IsAddress
        var addressError = await addressValidator.validate();
        if (addressError) {
            returnResult.err = addressError;
            returnResult.code = 400;
            return returnResult;
        }

        // phone number validation
        var phoneNumberValidator = new BaseValidator(salonInformation.phone.number);
        phoneNumberValidator = new MissingCheck(phoneNumberValidator, ErrorMessage.MissingPhoneNumber);
        phoneNumberValidator = new IsPhoneNumber(phoneNumberValidator, ErrorMessage.WrongPhoneNumberFormat);
        var phoneNumberError = await phoneNumberValidator.validate();
        if (phoneNumberError) {
            returnResult.err = phoneNumberError;
            returnResult.code = 400;
            return returnResult;
        }

        // email validation
        // email is not required, so check if email is in the request first.
        if (salonInformation.email) {
            var emailValidator = new BaseValidator(salonInformation.email);
            emailValidator = new IsEmail(emailValidator, ErrorMessage.WrongEmailFormat);
            var emailError = await emailValidator.validate();
            if (emailError) {
                returnResult.err = emailError;
                returnResult.code = 400;
                return returnResult;
            }

        }
        return returnResult;
    }

    /**
     * 
     * 
     * @returns {Promise<ISalonData>}
     * 
     * @memberOf SalonManagement
     */
    public async getSalonById(): Promise<ISalonData> {
        var salon: ISalonData = undefined;
        try {
            await SalonModel.findOne({ "_id": this.salonId }, { "profile": { "$elemMatch": { "salon_id": this.salonId } } }, ).exec(function (err, docs: ISalonData) {
                if (!err) {
                    salon = docs;
                } else {
                    salon = undefined;
                }
            });
        } catch (e) {
            salon = undefined;
        }
        return salon;
    }

}