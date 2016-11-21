
import { UserData, UserProfile } from './UserData'
import UserModel = require('./UserModel')
import { EmployeeManagementBehavior } from './EmployeeManagementBehavior'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { UserManagement } from './UserManagement';
import { BaseValidator } from './../../Core/Validation/BaseValidator'
import {
    IsInArray, IsNumber, IsPhoneNumber, IsString, IsSSN, MissingCheck, IsValidNameString, IsInRange, IsValidSalonId
} from './../../Core/Validation/ValidationDecorators'
import { EmployeeInput } from './../../Modules/UserManagement/EmployeeData';

export class EmployeeManagement extends UserManagement implements EmployeeManagementBehavior {

    activateEmployee(employeeId: string): boolean {
        return;
    };
    public async addEmployeeProfile(employeeId: string, profile: any): Promise<SalonCloudResponse<UserProfile>> {

        var returnResult: SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var newProfile: UserProfile = {
            role: profile.role,
            fullname: profile.fullname,
            salon_id: this.salonId,
            status: true,
            nickname: profile.nickname,
            salary_rate: profile.salary_rate,
            cash_rate: profile.cash_rate,
            social_security_number: profile.social_serurity_number,

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
     * @param  {EmployeeInput} employeeProfile
     */
    public async validation(employeeProfile: EmployeeInput) {

        var response: SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

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

        // 'fullname' validation
        var fullnameValidation = new BaseValidator(employeeProfile.fullname);
        fullnameValidation = new MissingCheck(fullnameValidation, ErrorMessage.MissingFullName);
        fullnameValidation = new IsValidNameString(fullnameValidation, ErrorMessage.InvalidNameString);
        var fullnameError = await fullnameValidation.validate();
        if (fullnameError) {
            response.err = fullnameError.err;
            response.code = 400;
            return response;
        }

        // 'nickname' validation
        var nicknameValidation = new BaseValidator(employeeProfile.nickname);
        nicknameValidation = new MissingCheck(nicknameValidation, ErrorMessage.MissingNickName);
        nicknameValidation = new IsValidNameString(nicknameValidation, ErrorMessage.InvalidNameString);
        var nicknameError = await nicknameValidation.validate();
        if (nicknameError) {
            response.err = nicknameError.err;
            response.code = 400;
            return response;
        }

        // 'salaryRate' validation
        var salaryRateValidation = new BaseValidator(employeeProfile.salary_rate);
        salaryRateValidation = new MissingCheck(salaryRateValidation, ErrorMessage.MissingSalaryRate);
        salaryRateValidation = new IsInRange(salaryRateValidation, ErrorMessage.SalaryRateRangeError, 0, 10);
        var salaryRateError = await salaryRateValidation.validate();
        if (salaryRateError) {
            response.err = salaryRateError.err;
            response.code = 400;
            return response;
        }

        // 'cashRate' validation
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
        return response;

    }

    deactivateEmployee(employeeId: string): boolean {
        return;
    };

    public async getAllEmployee(): Promise<SalonCloudResponse<Array<UserData>>> {
        var response: SalonCloudResponse<Array<UserData>> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        var userSearch = UserModel.find({ 'profile.salon_id': this.salonId, 'profile.status': true, 'profile.role': { $in: [2, 3] } }).exec();
        await userSearch.then(function (docs) {
            response.data = docs;
            response.code = 200;


        }, function (err) {
            response.err = err;
            response.code = 500;
        });
        return response;
    };

    getEmployee(employeeId: string): UserData {
        return;
    };

    updateEmployee(employeeId: string, profile: UserProfile): boolean {
        return;
    };

}