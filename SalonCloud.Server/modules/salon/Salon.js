"use strict";
const mongoose = require("mongoose");
exports.SalonSchema = new mongoose.Schema({
    salon_name: { type: String, required: true },
    address: { type: String, required: true },
    phonenumber: { type: String, required: true },
    email: String
});
exports.SalonModel = mongoose.model('Salon', exports.SalonSchema);
class Salon {
    CreateSalonInformation(salonData, callback) {
        //create salon object in database
        exports.SalonModel.create(salonData, (err, salon) => {
            if (err) {
                callback(null);
            }
            else {
                callback(salon);
            }
        });
    }
}
exports.Salon = Salon;
//# sourceMappingURL=Salon.js.map