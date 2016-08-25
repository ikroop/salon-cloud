"use strict";
const User_1 = require('./../User/User');
var ErrorMessage = require('./../../routes/ErrorMessage');
const Validator_1 = require('../../core/validator/Validator');
const SalonModel = require("./SalonModel");
class Salon {
    constructor(UserId) {
        this.UserId = UserId;
    }
    createSalonInformation(SalonProfileData, callback) {
        if (!SalonProfileData.information.salon_name) {
            callback(ErrorMessage.MissingSalonName, 400, undefined);
            return;
        }
        if (!SalonProfileData.information.location.address) {
            callback(ErrorMessage.MissingAddress, 400, undefined);
            return;
        }
        else {
            if (!Validator_1.Validator.IsAdress(SalonProfileData.information.location.address)) {
                callback(ErrorMessage.WrongAddressFormat, 400, undefined);
                return;
            }
        }
        if (!SalonProfileData.information.phone.number) {
            callback(ErrorMessage.MissingPhoneNumber, 400, undefined);
            return;
        }
        else {
            if (!Validator_1.Validator.IsPhoneNumber(SalonProfileData.information.phone.number)) {
                callback(ErrorMessage.WrongPhoneNumberFormat, 400, undefined);
                return;
            }
        }
        if (SalonProfileData.information.email && !Validator_1.Validator.IsEmail(SalonProfileData.information.email)) {
            callback(ErrorMessage.WrongEmailFormat, 400, undefined);
            return;
        }
        //create salon object in database
        SalonModel.create(SalonProfileData, (err, salon) => {
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            }
            else {
                this.SalonId = salon._id;
                var user = new User_1.User(this.SalonId, this.UserId);
                user.createProfile({
                    "salon_id": this.SalonId,
                    "role": User_1.User.SALON_OWNER_ROLE,
                    "status": true
                }, function (err, code, data) {
                    if (err) {
                        callback(err, code, undefined);
                    }
                    else {
                        callback(undefined, 200, salon);
                    }
                });
            }
        });
    }
    /**
     *
     */
    static isExisting(salon_id, callback) {
        SalonModel.findOne({ "_id": salon_id }, function (err, docs) {
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            }
            else if (!docs) {
                callback(undefined, 200, false);
            }
            else {
                callback(undefined, 200, true);
            }
        });
    }
}
exports.Salon = Salon;
//# sourceMappingURL=Salon.js.map