"use strict";
/**
 *
 */
const mongoose = require("mongoose");
var ErrorMessage = require('./../../routes/ErrorMessage');
const Validator_1 = require('../../core/validator/Validator');
const salon_1 = require('../../modules/salon/salon');
const UserModel = require("./../../core/authentication/AuthenticationModel");
class User {
    constructor(SalonId, UserId) {
        this.UserId = UserId;
        this.SalonId = SalonId;
    }
    createProfile(profileData, callback) {
        if (!profileData.salon_id) {
            callback(ErrorMessage.MissingSalonId, 400, undefined);
            return;
        }
        else if (!Validator_1.Validator.IsIdentifyString(profileData.salon_id)) {
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
        }
        else if (profileData.role <= 0 || profileData.role >= 5) {
            callback(ErrorMessage.RoleRangeError, 400, undefined);
            return;
        }
        if (profileData.social_security_number && !Validator_1.Validator.IsSocialSecurityNumber(profileData.social_security_number)) {
            callback(ErrorMessage.WrongSSNFormat, 400, undefined);
            return;
        }
        if (profileData.social_security_number && !Validator_1.Validator.IsSocialSecurityNumber(profileData.social_security_number)) {
            callback(ErrorMessage.WrongSSNFormat, 400, undefined);
            return;
        }
        if (profileData.salary_rate && !Validator_1.Validator.IsSalaryRate(profileData.salary_rate)) {
            callback(ErrorMessage.SalaryRateRangeError, 400, undefined);
            return;
        }
        if (profileData.cash_rate && !Validator_1.Validator.IsCashRate(profileData.cash_rate)) {
            callback(ErrorMessage.CashRateRangeError, 400, undefined);
            return;
        }
        var UserId = this.UserId;
        var SalonId = mongoose.Types.ObjectId(this.SalonId);
        UserModel.findOne({ "_id": this.UserId, "profile.salon_id": this.SalonId }, function (err, docs) {
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            }
            else if (!docs) {
                salon_1.Salon.isExisting(profileData.salon_id, function (err, code, data) {
                    if (err) {
                        callback(err, code, undefined);
                    }
                    else if (data) {
                        UserModel.findOne({ "_id": UserId }, function (err, docs) {
                            docs.profile.push(profileData);
                            docs.save();
                            docs.profile = docs.profile.filter(profile => profile.salon_id == profileData.salon_id);
                            callback(undefined, 200, docs);
                        });
                    }
                    else {
                        callback(ErrorMessage.SalonNotFound, 400, undefined);
                    }
                });
            }
            else {
                callback(ErrorMessage.ProfileAlreadyExist, 409, undefined);
            }
        });
    }
}
User.SALON_OWNER_ROLE = 1;
User.SALON_MANAGER_ROLE = 2;
User.SALON_TECHNICIAN_ROLE = 3;
User.SALON_CUSTOMER_ROLE = 4;
exports.User = User;
//# sourceMappingURL=User.js.map