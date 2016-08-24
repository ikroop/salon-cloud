/**
 * 
 */
import * as mongoose from "mongoose";
import {UserProfile} from "./UserProfile";
import {AuthenticationSchema} from "./../../core/authentication/AuthenticationModel";
var ErrorMessage = require('./../../routes/ErrorMessage');
import {Validator} from '../../core/validator/Validator';

var UserModel = mongoose.model('User', AuthenticationSchema);

export class User {
    private UserId: string;
    private SalonId: string;
    public static SALON_OWNER_ROLE = 1;
    public static SALON_MANAGER_ROLE = 2;
    public static SALON_TECHNICIAN_ROLE = 3;
    public static SALON_CUSTOMER_ROLE = 4;

    constructor(SalonId: string, UserId: string) {
        this.UserId = UserId;
        this.SalonId = SalonId;
    }
    createProfile(profileData: UserProfile, callback) {
        if (!profileData.salon_id) {
            callback(ErrorMessage.MissingSalonId, 400, undefined);
            return;
        }

        if (!profileData.status) {
            callback(ErrorMessage.MissingStatus, 400, undefined);
            return;
        }

        if (!profileData.role) {
            callback(ErrorMessage.MissingRole, 400, undefined);
            return;
        }else if (profileData.role <= 0 || profileData.role >= 5 ){
            callback(ErrorMessage.RoleRangeError, 400, undefined);
            return;
        }

        if (profileData.social_security_number && !Validator.IsSocialSecurityNumber(profileData.social_security_number)) {
            callback(ErrorMessage.WrongSSNFormat, 400, undefined);
            return;
        }

        if (profileData.social_security_number && !Validator.IsSocialSecurityNumber(profileData.social_security_number)) {
            callback(ErrorMessage.WrongSSNFormat, 400, undefined);
            return;
        }

        if (profileData.salary_rate && !Validator.IsSalaryRate(profileData.salary_rate)){
            callback(ErrorMessage.SalaryRateRangeError, 400, undefined);
            return;
        }

        if (profileData.cash_rate && !Validator.IsCashRate(profileData.cash_rate)){
            callback(ErrorMessage.CashRateRangeError, 400, undefined);
            return;
        }
        
        UserModel.findOne({ "_id": this.UserId }, function (err, docs) {
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            }
            if (docs) {
                docs.profile.push(profileData);    
                docs.save();
                callback(undefined, 200, docs);    
            }
        });
    }
}