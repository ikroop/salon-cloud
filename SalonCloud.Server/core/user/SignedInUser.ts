

import { SignedInUserBehavior } from './SignedInUserBehavior'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { SalonManagement } from './../../modules/salonManagement/SalonManagement'
import { SalonInformation } from './../../modules/salonManagement/SalonData'
import { SalonSchedule } from './../../modules/schedule/SalonSchedule'
import { Schedule } from './../../modules/schedule/Schedule'
import { defaultWeeklySchedule } from './../defaultData'
import { UserManagement } from './../../modules/userManagement/UserManagement'
import { UserProfile } from './../../modules/userManagement/UserData'
import { ServiceManagement } from './../../modules/serviceManagement/ServiceManagement'
import { ServiceGroupData } from './../../modules/serviceManagement/ServiceData'
import { samplesService1, samplesService2 } from './../defaultData'
import { BaseValidator } from './../validation/BaseValidator'
import { MissingCheck, IsPhoneNumber, IsEmail, IsString } from './../validation/ValidationDecorators'
import { ErrorMessage } from './../ErrorMessage'

export class SignedInUser implements SignedInUserBehavior {

    salonManagementDP: SalonManagement;
    userManagementDP: UserManagement;
    //Todo: neccesary??
    //salonScheduleDP: Schedule;

    constructor(salonManagementDP: SalonManagement, userManagementDP: UserManagement) {
        this.salonManagementDP = salonManagementDP;
        this.userManagementDP = userManagementDP;
    }

    public async createSalon(salonInformation: SalonInformation){

        var returnResult: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        //step 1: validation;
            //salon name validation
        var salonNameValidator = new BaseValidator(salonInformation.salon_name);
        salonNameValidator = new MissingCheck(salonNameValidator, ErrorMessage.MissingSalonName);
        var salonNameError = await salonNameValidator.validate();
        if(salonNameError){
            returnResult.err = salonNameError.err;
            returnResult.code = 400;
            return  returnResult;
        }
            //address validation 
        var addressValidator = new BaseValidator(salonInformation.location.address);
        addressValidator = new MissingCheck(addressValidator, ErrorMessage.MissingAddress);
        //Todo: validator for IsAddress
        var addressError = await addressValidator.validate();
        if(addressError){
            returnResult.err = addressError.err;
            returnResult.code = 400;
            return returnResult;
        }      
            //phone number validation
        var phoneNumberValidator = new BaseValidator(salonInformation.phone.number);
        phoneNumberValidator = new MissingCheck(phoneNumberValidator, ErrorMessage.MissingPhoneNumber);
        phoneNumberValidator = new IsPhoneNumber(phoneNumberValidator, ErrorMessage.WrongPhoneNumberFormat);
        var phoneNumberError = await phoneNumberValidator.validate();
        if(phoneNumberError){
            returnResult.err = phoneNumberError.err;
            returnResult.code = 400;
            return returnResult;
        }

            //email validation
            //email is not required, so check if email is in the request first.
        if(salonInformation.email){
            var emailValidator = new BaseValidator(salonInformation.email);
            emailValidator = new IsEmail(emailValidator, ErrorMessage.WrongEmailFormat);
            var emailError = await emailValidator.validate();
            if(emailError){
                returnResult.err = emailError.err;
                returnResult.code = 400;
                return returnResult;
            }

        }
        



        //step 2: create salon docs;
        var salonData = await this.salonManagementDP.createSalonDocs(salonInformation);

        //step 3: create default schedule;
        var scheduleDP = new SalonSchedule(salonData.data._id);
        var defaultSchedule = await scheduleDP.saveWeeklySchedule(defaultWeeklySchedule);

        //step 4: create sample services;
        var serviceDP = new ServiceManagement(salonData.data._id);

        //samplesService1.salon_id = salonData.data._id;
        samplesService2.salon_id = salonData.data._id;
        samplesService1.salon_id = salonData.data._id.toString();
        //samplesService2.salon_id = samplesService1.salon_id.toString();
        var sampleServices: [ServiceGroupData] = [samplesService1, samplesService2];

        var addSampleServicesAction = await serviceDP.addGroup(samplesService2);

        //step 5: update user profile;
        var profile = await this.userManagementDP.addProfile(salonData.data._id, 1); //Todo
        returnResult.data = {
            salon_id: salonData.data._id,
            uid: this.userManagementDP.user_id,
            role: profile.data.role,
            default_schedule: defaultSchedule.data,
            sample_services: addSampleServicesAction.data,
            salon_data: salonData.data
        }
        returnResult.code = 200;
        return returnResult;
    };

    public getSalonList(): SalonCloudResponse<Array<SalonInformation>> {

        return;
    };

    public selectSalon(SalonId: string): SalonCloudResponse<boolean> {
        return;
    };

    public async addNewProfile(salonId: string){
        var returnResult : SalonCloudResponse<UserProfile> ={
            code: undefined,
            err: undefined,
            data: undefined
        };
        var returnResult = await this.userManagementDP.addProfile(salonId, 1);
        return returnResult;
    };


}