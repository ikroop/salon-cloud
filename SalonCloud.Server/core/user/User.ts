/**
 * 
 */
import { mongoose } from "../../services/database";
import {UserData, UserProfile} from "./UserData";
var ErrorMessage = require('./../../routes/ErrorMessage');
import {Validator} from '../../core/validator/Validator';
import {Salon} from '../../modules/salon/salon';
import UserModel = require("./UserModel");

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
    createPublicProfile(profileData: UserProfile, callback) {
        if (!profileData.salon_id) {
            callback(ErrorMessage.MissingSalonId, 400, undefined);
            return;
        } else if (!Validator.IsIdentifyString(profileData.salon_id)) {
            callback(ErrorMessage.WrongIdFormat, 400, undefined);
            return;
        }

        if (!profileData.status) {
            callback(ErrorMessage.MissingStatus, 400, undefined);
            return;
        }

        if (!profileData.role) {
            callback(ErrorMessage.MissingRole, 400, undefined);
            return;
        } else if (profileData.role <= 0 || profileData.role >= 5) {
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

        if (profileData.salary_rate && !Validator.IsSalaryRate(profileData.salary_rate)) {
            callback(ErrorMessage.SalaryRateRangeError, 400, undefined);
            return;
        }

        if (profileData.cash_rate && !Validator.IsCashRate(profileData.cash_rate)) {
            callback(ErrorMessage.CashRateRangeError, 400, undefined);
            return;
        }

        var UserId = this.UserId;
        var SalonId = new mongoose.Types.ObjectId(this.SalonId);

        UserModel.findOne({ "_id": this.UserId, "profile.salon_id": this.SalonId }, function (err, docs) {
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            } else if (!docs) {
                Salon.isExisting(profileData.salon_id, function (err, code, data) {
                    if (err) {
                        callback(err, code, undefined);
                    } else if (data) { // Salon is existing
                        UserModel.findOne({ "_id": UserId }, function (err, docs) {
                            docs.profile.push(profileData);
                            docs.save();
                            docs.profile = docs.profile.filter(profile => profile.salon_id == profileData.salon_id);
                            callback(undefined, 200, docs);
                        });
                    } else { //Salon is not found.
                        callback(ErrorMessage.SalonNotFound, 400, undefined);
                    }
                });

            } else {
                callback(ErrorMessage.ProfileAlreadyExist, 409, undefined);
            }
        });
    }
}