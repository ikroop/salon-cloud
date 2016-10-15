/**
 * 
 * 
 * 
 */
import { SalonManagementBehavior } from './SalonManagementBehavior'
import { SalonData, SalonInformation, SalonSetting } from './SalonData'
import { SalonCloudResponse } from './../../core/SalonCloudResponse'
import { SalonModel, SalonProfileSchema } from './SalonModel'
import { defaultSalonSetting } from './../../core/defaultData'
import { BaseValidator } from './../../core/validation/BaseValidator'
import { MissingCheck, IsPhoneNumber, IsEmail, IsString } from './../../core/validation/ValidationDecorators'
import { ErrorMessage } from './../../core/ErrorMessage'

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
	*@name: createSalonDocs
    *@parameter: SalonInformation
    *@return: Mongoose result
    * - Connect database and create salon record
	*/
    public async createSalonDocs(salonInformation: SalonInformation) {

        var returnResult: SalonCloudResponse<SalonData> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var salonData: SalonData = {
            information: salonInformation,
            setting: defaultSalonSetting,
        }
        // create Salon record
        var SalonCreation = SalonModel.create(salonData);
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

    public async validation(salonInformation: SalonInformation): any {
        var returnResult: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        // Validation
        // salon name validation
        var salonNameValidator = new BaseValidator(salonInformation.salon_name);
        salonNameValidator = new MissingCheck(salonNameValidator, ErrorMessage.MissingSalonName);
        var salonNameError = await salonNameValidator.validate();
        if (salonNameError) {
            returnResult.err = salonNameError.err;
            returnResult.code = 400;
            return returnResult;
        }
        // address validation 
        var addressValidator = new BaseValidator(salonInformation.location.address);
        addressValidator = new MissingCheck(addressValidator, ErrorMessage.MissingAddress);
        // TODO: validator for IsAddress
        var addressError = await addressValidator.validate();
        if (addressError) {
            returnResult.err = addressError.err;
            returnResult.code = 400;
            return returnResult;
        }

        // phone number validation
        var phoneNumberValidator = new BaseValidator(salonInformation.phone.number);
        phoneNumberValidator = new MissingCheck(phoneNumberValidator, ErrorMessage.MissingPhoneNumber);
        phoneNumberValidator = new IsPhoneNumber(phoneNumberValidator, ErrorMessage.WrongPhoneNumberFormat);
        var phoneNumberError = await phoneNumberValidator.validate();
        if (phoneNumberError) {
            returnResult.err = phoneNumberError.err;
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
                returnResult.err = emailError.err;
                returnResult.code = 400;
                return returnResult;
            }

        }
        return returnResult;
    }


}