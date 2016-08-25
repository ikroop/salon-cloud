"use strict";
const mongoose = require("mongoose");
exports.WeeklyScheduleSchema = new mongoose.Schema({
    id: { type: String, required: true },
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    dayofweek: { type: Number, required: true }
});
exports.WeeklyScheduleModel = mongoose.model('WeeklySchedule', exports.WeeklyScheduleSchema);
//# sourceMappingURL=WeeklyScheduleModel.js.map