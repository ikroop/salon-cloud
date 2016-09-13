"use strict";
/**
 *
 *
 */
const database_1 = require("../../services/database");
exports.SalonProfileSchema = new database_1.mongoose.Schema({
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
module.exports = database_1.mongoose.model('salon', exports.SalonProfileSchema);
//# sourceMappingURL=SalonModel.js.map