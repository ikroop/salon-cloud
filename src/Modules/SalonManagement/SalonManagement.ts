/**
 * 
 * 
 * 
 */
import { SalonManagementBehavior } from './SalonManagementBehavior'
import { ISalonData, SalonData, SalonInformation, SalonSetting } from './SalonData'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { defaultSalonSetting } from './../../Core/DefaultData'
import { BaseValidator } from './../../Core/Validation/BaseValidator'
import { MissingCheck, IsPhoneNumber, IsEmail, IsString, IsValidUserId, IsValidSalonId } from './../../Core/Validation/ValidationDecorators'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { GoogleMap } from './../../Core/GoogleMap/GoogleMap';
import { SalonManagementDatabaseInterface } from './../../Services/SalonDatabase/SalonManagementDatabaseInterface';
import { FirebaseSalonManagement } from './../../Services/SalonDatabase/Firebase/FirebaseSalonManagement'
import { FirebaseUserManagement } from './../../Services/UserDatabase/Firebase/FirebaseUserManagement'

export class SalonManagement implements SalonManagementBehavior {

    private salonId: string;
    private salonDatabase: SalonManagementDatabaseInterface<ISalonData>;


    /**
     * Creates an instance of SalonManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf SalonManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
        this.salonDatabase = new FirebaseSalonManagement(this.salonId);
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
     * @returns {Promise<SalonCloudResponse<ISalonData>>}
     * 
     * @memberOf SalonManagement
     */
    public async createSalonDocs(salonInformation: SalonInformation): Promise<SalonCloudResponse<ISalonData>> {

        var returnResult: SalonCloudResponse<ISalonData> = {
            code: null,
            data: null,
            err: null
        };
        var salonData: SalonData = {
            information: salonInformation,
            setting: defaultSalonSetting,
        }

        var validations = await this.validation(salonInformation);
        if (validations.err) {
            returnResult.err = validations.err;
            returnResult.code = validations.code;
            return validations;
        }
        // get Timezone from address and puts that into salon information constructor
        // TODO:
        var Timezone: any = await GoogleMap.getTimeZone(salonInformation.location.address);
        salonInformation.location.timezone_id = Timezone['timeZoneId'];

        // create Salon record
        try {
            var rs = await this.salonDatabase.createSalon(salonData);
            returnResult.code = 200;
            returnResult.data = rs;
        } catch (error) {
            returnResult.code = 500;
            returnResult.err = ErrorMessage.ServerError;
        }

        return returnResult;
    };

    public createSetting(salonId: string, setting: SalonSetting): SalonCloudResponse<boolean> {
        return;
    };

    public deactivate(): SalonCloudResponse<boolean> {
        return;
    };

    /**
     * 
     * This function get the information of all the salons that the user is connected to.
     * @param {string} userId
     * @returns {Promise<SalonCloudResponse<Array<SalonInformation>>>}
     * 
     * @memberOf SalonManagement
     */
    public async getAllSalon(userId: string): Promise<SalonCloudResponse<Array<SalonInformation>>> {
        var response: SalonCloudResponse<Array<SalonInformation>> = {
            code: null,
            data: null,
            err: null
        }
        //validation
        var userIdValidation = new BaseValidator(userId);
        userIdValidation = new MissingCheck(userIdValidation, ErrorMessage.MissingUserId);
        userIdValidation = new IsValidUserId(userIdValidation, ErrorMessage.InvalidUserId);
        var userIdValidationResult = await userIdValidation.validate();
        if (userIdValidationResult) {
            response.err = userIdValidationResult.err;
            response.code = 400;
            return response;
        }

        var database = new FirebaseUserManagement(null);
        var getSalonInfoList = await database.getSalonInformationList(userId);
        if (getSalonInfoList) {
            response.data = getSalonInfoList;
            response.code = 200;
        } else {
            response.data = null;
            response.code = 200;
        }
        return response;
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
    public async getFlexibleTime(): Promise<number> {
        var salon: ISalonData = null;
        salon = await this.salonDatabase.getSalonById();
        return salon.setting.flexible_time;
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
            code: null,
            data: null,
            err: null
        };
        // Validation
        // salon name validation
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
    public async getSalonById(): Promise<SalonCloudResponse<ISalonData>> {

        var returnResult: SalonCloudResponse<ISalonData> = {
            code: null,
            data: null,
            err: null
        };

        var salonProfile: ISalonData = null;

        var salonIdValidation = new BaseValidator(this.salonId);
        salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId);
        salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound);
        var salonIdError = await salonIdValidation.validate();

        if (salonIdError) {
            returnResult.err = salonIdError.err;
            returnResult.code = 400; //Bad Request
            return returnResult;
        }

        try {
            salonProfile = await this.salonDatabase.getSalonById();
            if (salonProfile) {
                returnResult.code = 200;
                returnResult.data = salonProfile;
            }
        } catch (error) {
            returnResult.code = 500;
            returnResult.err = error;
        }

        return returnResult;
    }

}