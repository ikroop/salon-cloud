


import { AbstractAdministrator } from './AbstractAdministrator'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { UserProfile, UserData } from './../../modules/userManagement/UserData'
import { AppointmentData } from './../../modules/appointmentManagement/AppointmentData'
import { DailyDayData, WeeklyDayData } from './../../modules/schedule/ScheduleData'
import { SalonInformation, SalonSetting } from './../../modules/salonManagement/SalonData'
import { Verification } from './../verification/Verification'
import { Authentication } from './../authentication/Authentication'
import { EmployeeManagement } from './../../modules/userManagement/EmployeeManagement'
import { ErrorMessage } from './../ErrorMessage'
import { BaseValidator } from './../validation/BaseValidator'
import {
    IsInArray, IsNumber, IsPhoneNumber, IsString, IsSSN, MissingCheck, IsValidNameString, IsInRange, IsValidSalonId
} from './../validation/ValidationDecorators'


export class Owner extends AbstractAdministrator {

    /**
     * @name: addEmployee
     * @param: {salonId: string, employeeData: UserData, verificationObj: Verification}
     * @return: Promise<SalonCloudResponse<any>>
     * @returnDataStructure: {
     *  salon_id: string,
     *  uid: string,
     *  username: string,
     *  fullname: string,
     *  role: number
     *  }
     * -- validation;
     * -- create employee account with username
     * -- send verification if successfully create account
     * -- add new profile to the account
     * -- return 
     *     - uid: accountCreation.data.user._id,
     *     - salon_id: employeeProfile.salon_id,
     *     - username: username,
     *     - phone: employeeProfile.phone,
     *     - fullname: employeeProfile.fullname,
     *     - role: employeeProfile.role
     */
    public async addEmployee(username: string, employeeProfile: any, verificationObj: Verification): Promise<SalonCloudResponse<any>> {
        var response: SalonCloudResponse<any> = {
            code: undefined,
            data: undefined,
            err: undefined
        }

        // validation:
        // 'role' validation:
        var roleValidation = new BaseValidator(employeeProfile.role);
        roleValidation = new MissingCheck(roleValidation, ErrorMessage.MissingRole);
        roleValidation = new IsInRange(roleValidation, ErrorMessage.RoleRangeError, 1, 4);
        roleValidation = new IsInArray(roleValidation, ErrorMessage.UnacceptedRoleForAddedEmployeeError, [2, 3]);
        var roleError = await roleValidation.validate();
        if (roleError) {
            response.err = roleError.err;
            response.code = 400;
            return response;
        }

        // SalonId validation
        var salonIdValidation = new BaseValidator(employeeProfile.salon_id);
        salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId);
        salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound);
        var salonIdError = await salonIdValidation.validate();
        if (salonIdError) {
            response.err = salonIdError.err;
            response.code = 400;
            return response;
        }

        // Phone Number validation
        var phoneNumberValidation = new BaseValidator(employeeProfile.phone);
        phoneNumberValidation = new MissingCheck(phoneNumberValidation, ErrorMessage.MissingPhoneNumber);
        phoneNumberValidation = new IsPhoneNumber(phoneNumberValidation, ErrorMessage.WrongPhoneNumberFormat);
        var phoneNumberError = await phoneNumberValidation.validate();
        if (phoneNumberError) {
            response.err = phoneNumberError.err;
            response.code = 400;
            return response;
        }

        // Fullname validation
        var fullnameValidation = new BaseValidator(employeeProfile.fullname);
        fullnameValidation = new MissingCheck(fullnameValidation, ErrorMessage.MissingFullName);
        fullnameValidation = new IsValidNameString(fullnameValidation, ErrorMessage.InvalidNameString);
        var fullnameError = await fullnameValidation.validate();
        if (fullnameError) {
            response.err = fullnameError.err;
            response.code = 400;
            return response;
        }

        // Nickname validation
        var nicknameValidation = new BaseValidator(employeeProfile.nickname);
        nicknameValidation = new MissingCheck(nicknameValidation, ErrorMessage.MissingNickName);
        nicknameValidation = new IsValidNameString(nicknameValidation, ErrorMessage.InvalidNameString);
        var nicknameError = await nicknameValidation.validate();
        if (nicknameError) {
            response.err = nicknameError.err;
            response.code = 400;
            return response;
        }

        // Salary Rate validation
        var salaryRateValidation = new BaseValidator(employeeProfile.salary_rate);
        salaryRateValidation = new MissingCheck(salaryRateValidation, ErrorMessage.MissingSalaryRate);
        salaryRateValidation = new IsInRange(salaryRateValidation, ErrorMessage.SalaryRateRangeError, 0, 10);
        var salaryRateError = await salaryRateValidation.validate();
        if (salaryRateError) {
            response.err = salaryRateError.err;
            response.code = 400;
            return response;
        }

        // Cash Rate Validation
        var cashRateValidation = new BaseValidator(employeeProfile.cash_rate);
        cashRateValidation = new MissingCheck(cashRateValidation, ErrorMessage.MissingCashRate);
        cashRateValidation = new IsInRange(cashRateValidation, ErrorMessage.CashRateRangeError, 0, 10);
        var cashRateError = await cashRateValidation.validate();
        if (cashRateError) {
            response.err = cashRateError.err;
            response.code = 400;
            return response;
        }

        // Social Security Number
        if (employeeProfile.social_security_number) {
            var ssnValidation = new BaseValidator(employeeProfile.social_security_number);
            ssnValidation = new IsSSN(ssnValidation, ErrorMessage.WrongSSNFormat);
            var ssnError = await ssnValidation.validate();
            if (ssnError) {
                response.err = ssnError.err;
                response.code = 400;
                return response;
            }
        }

        // create employee account with username;
        var authObject = new Authentication();
        var accountCreation = await authObject.signUpWithAutoGeneratedPassword(username);
        // send verification if successfully create account
        if (accountCreation.err) {
            response.err = accountCreation.err;
            response.code = accountCreation.code;
            return response;
        } else {
            let content = "Your account with Salonhelp has been successfully created! Username: " + username + ", Password: " + accountCreation.data.password;
            verificationObj.sendContent(username, content);
        }

        // add new profile to the account
        let employeeManagementDP = new EmployeeManagement(employeeProfile.salon_id);
        let addProfileAction = await employeeManagementDP.addProfile(accountCreation.data.user._id, employeeProfile);
        response.data = {
            uid: accountCreation.data.user._id,
            salon_id: employeeProfile.salon_id,
            username: username,
            phone: employeeProfile.phone,
            fullname: employeeProfile.fullname,
            role: employeeProfile.role,
        }
        response.code = 200;

        return response;


    }

    public activateEmployee(employeeId: string): SalonCloudResponse<boolean> {

        return;
    };

    public activateSalon(salonId: string): boolean {

        return;

    };

    public addService() {

        return;
    };

    public deactivateEmployee(emplpoyeeId: string): boolean {

        return;
    };

    public deativateSalon(salonId: string): boolean {
        return;
    };

    public removeService() {

        return;
    };

    public updateEmployeeProfile(employee: UserProfile): boolean {

        return;
    };

    public updateSalonDailySchedule(dailySchedule: DailyDayData) {

    };

    public updateSalonInformation(info: SalonInformation) {

    };

    public updateSalonSetting(setting: SalonSetting) {

    };

    public updateSalonWeeklySchedule(weeklySchedule: WeeklyDayData) {

    };

    public updateService() {

    };

    public getSchedule(start: Date, end: Date): SalonCloudResponse<Array<DailyDayData>> {

        return;
    };

    protected filterProfileData(user: UserProfile): UserProfile {

        return;
    }
}