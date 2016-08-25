"use strict";
/**
 *
 *
 */
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
module.exports = mongoose.model('salon', exports.SalonProfileSchema);
//# sourceMappingURL=SalonModel.js.map