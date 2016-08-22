"use strict";
const User_1 = require('./../User/User');
const mongoose = require("mongoose");
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
        //create salon object in database
        exports.SalonProfileModel.create(SalonProfileData, (err, salon) => {
            if (err) {
                callback(null);
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
                callback(salon);
            }
        });
    }
}
exports.Salon = Salon;
//# sourceMappingURL=Salon.js.map