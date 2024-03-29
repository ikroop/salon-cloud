/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { UserData, UserProfile, IUserData } from './UserData'
import { EmployeeManagementBehavior } from './EmployeeManagementBehavior'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { UserManagement } from './UserManagement';
import { BaseValidator } from './../../Core/Validation/BaseValidator'
import {
    IsInArray, IsNumber, IsPhoneNumber, IsString, IsSSN, MissingCheck, IsValidNameString, IsInRange, IsValidSalonId
} from './../../Core/Validation/ValidationDecorators'

export class EmployeeManagement extends UserManagement implements EmployeeManagementBehavior {

    activateEmployee(employeeId: string): boolean {
        return;
    };

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {*} profile
     * @returns {Promise<SalonCloudResponse<UserProfile>>}
     * 
     * @memberOf EmployeeManagement
     */
    public async addEmployeeProfile(employeeId: string, profile: UserProfile): Promise<SalonCloudResponse<UserProfile>> {

        var returnResult: SalonCloudResponse<UserProfile> = {
            code: null,
            data: null,
            err: null
        };

        var validations = await this.validation(profile);
        if (validations.err) {
            returnResult.code = validations.code;
            returnResult.err = validations.err;
            return returnResult;
        }
        var newProfile: UserProfile = {
            role: profile.role,
            fullname: profile.fullname,
            salon_id: this.salonId,
            status: true,
            nickname: profile.nickname,
            salary_rate: profile.salary_rate || null,
            cash_rate: profile.cash_rate || null,
            social_security_number: profile.social_security_number || null,

        }
        let addProfileAction = await this.addProfile(employeeId, newProfile);
        if (addProfileAction.err) {
            returnResult.err = addProfileAction.err;
            returnResult.code = addProfileAction.code;
            return returnResult;
        } else {
            returnResult.code = addProfileAction.code;
            returnResult.data = addProfileAction.data;
            return returnResult;
        }

    };

    /**
     * 
     * 
     * @param {EmployeeInput} employeeProfile
     * @returns
     * 
     * @memberOf EmployeeManagement
     */
    public async validation(employeeProfile: UserProfile) {

        var response: SalonCloudResponse<UserProfile> = {
            code: null,
            data: null,
            err: null
        };
        // 'phone' validation
        var phoneNumberValidation = new BaseValidator(employeeProfile.phone);
        phoneNumberValidation = new MissingCheck(phoneNumberValidation, ErrorMessage.MissingPhoneNumber.err);
        phoneNumberValidation = new IsPhoneNumber(phoneNumberValidation, ErrorMessage.WrongPhoneNumberFormat.err);
        var phoneNumberError = await phoneNumberValidation.validate();
        if (phoneNumberError) {
            response.err = phoneNumberError;
            response.code = 400;
            return response;
        }

        // validation:
        // 'role' validation:
        var roleValidation = new BaseValidator(employeeProfile.role);
        roleValidation = new MissingCheck(roleValidation, ErrorMessage.MissingRole.err);
        roleValidation = new IsInRange(roleValidation, ErrorMessage.RoleRangeError.err, 1, 4);
        roleValidation = new IsInArray(roleValidation, ErrorMessage.UnacceptedRoleForAddedEmployeeError.err, [2, 3]);
        var roleError = await roleValidation.validate();
        if (roleError) {
            response.err = roleError;
            response.code = 400;
            return response;
        }

        // 'fullname' validation
        var fullnameValidation = new BaseValidator(employeeProfile.fullname);
        fullnameValidation = new MissingCheck(fullnameValidation, ErrorMessage.MissingFullName.err);
        fullnameValidation = new IsValidNameString(fullnameValidation, ErrorMessage.InvalidNameString.err);
        var fullnameError = await fullnameValidation.validate();
        if (fullnameError) {
            response.err = fullnameError;
            response.code = 400;
            return response;
        }

        // 'nickname' validation
        var nicknameValidation = new BaseValidator(employeeProfile.nickname);
        nicknameValidation = new MissingCheck(nicknameValidation, ErrorMessage.MissingNickName.err);
        nicknameValidation = new IsValidNameString(nicknameValidation, ErrorMessage.InvalidNameString.err);
        var nicknameError = await nicknameValidation.validate();
        if (nicknameError) {
            response.err = nicknameError;
            response.code = 400;
            return response;
        }

        // 'salaryRate' validation
        var salaryRateValidation = new BaseValidator(employeeProfile.salary_rate);
        salaryRateValidation = new MissingCheck(salaryRateValidation, ErrorMessage.MissingSalaryRate.err);
        salaryRateValidation = new IsInRange(salaryRateValidation, ErrorMessage.SalaryRateRangeError.err, 0, 10);
        var salaryRateError = await salaryRateValidation.validate();
        if (salaryRateError) {
            response.err = salaryRateError;
            response.code = 400;
            return response;
        }

        // 'cashRate' validation
        var cashRateValidation = new BaseValidator(employeeProfile.cash_rate);
        cashRateValidation = new MissingCheck(cashRateValidation, ErrorMessage.MissingCashRate.err);
        cashRateValidation = new IsInRange(cashRateValidation, ErrorMessage.CashRateRangeError.err, 0, 10);
        var cashRateError = await cashRateValidation.validate();
        if (cashRateError) {
            response.err = cashRateError;
            response.code = 400;
            return response;
        }

        // Social Security Number
        if (employeeProfile.social_security_number) {
            var ssnValidation = new BaseValidator(employeeProfile.social_security_number);
            ssnValidation = new IsSSN(ssnValidation, ErrorMessage.WrongSSNFormat.err);
            var ssnError = await ssnValidation.validate();
            if (ssnError) {
                response.err = ssnError;
                response.code = 400;
                return response;
            }
        }
        return response;

    }

    deactivateEmployee(employeeId: string): boolean {
        return;
    };

    /**
     * 
     * 
     * @returns {Promise<SalonCloudResponse<Array<UserData>>>}
     * 
     * @memberOf EmployeeManagement
     */
    public async getAllEmployee(): Promise<SalonCloudResponse<Array<IUserData>>> {
        var response: SalonCloudResponse<Array<UserData>> = {
            data: null,
            code: null,
            err: null
        }
        var employees: IUserData[] = await this.userDatabase.getAllEmployees();
        if (employees) {
            response.data = employees;
            response.code = 200;
        } 
        return response;
    };

    getEmployee(employeeId: string): UserData {
        return;
    };

    updateEmployee(employeeId: string, profile: UserProfile): boolean {
        return;
    };

}