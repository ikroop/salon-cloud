"use strict";
const mongoose = require("mongoose");
const ScheduleModel_1 = require('./ScheduleModel');
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
class WeeklySchedule extends ScheduleModel_1.Schedule {
}
exports.WeeklySchedule = WeeklySchedule;
//# sourceMappingURL=WeeklyScheduleModel.js.map