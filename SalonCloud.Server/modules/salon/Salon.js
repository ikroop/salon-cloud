"use strict";
const User_1 = require('./../User/User');
const mongoose = require("mongoose");
var ErrorMessage = require('./../../routes/ErrorMessage');
const Validator_1 = require('../../core/validator/Validator');
exports.SalonProfileSchema = new mongoose.Schema({
    setting: {
        appointment_reminder: { type: Boolean, required: true },
        flexible_time: { type: Number, required: true },
        technician_checkout: { type: Boolean, required: true }
    },
    information: {
        salon_name: { type: String, required: true },
        phone: {
            number: { type: String, required: true },
            is_verified: { type: Boolean, required: true }
        },
        location: {
            address: { type: String, required: true },
            is_verified: { type: Boolean, required: true }
        },
        email: String
    }
});
exports.SalonProfileModel = mongoose.model('Salon', exports.SalonProfileSchema);
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
        exports.SalonProfileModel.create(SalonProfileData, (err, salon) => {
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
                }, function (data) {
                });
                callback(undefined, 200, salon);
            }
        });
    }
}
exports.Salon = Salon;
//# sourceMappingURL=Salon.js.map