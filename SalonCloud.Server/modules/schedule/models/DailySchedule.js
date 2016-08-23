"use strict";
const mongoose = require("mongoose");
const ScheduleData_1 = require('./ScheduleData');
// import {UserProfileSchema} from '../../user/UserProfile';
exports.DailyScheduleSchema = new mongoose.Schema({
    id: { type: String, required: true },
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    date: { type: Number, required: true }
});
exports.DailyScheduleModel = mongoose.model('DailySchedule', exports.DailyScheduleSchema);
class DailySchedule extends ScheduleData_1.Schedule {
}
exports.DailySchedule = DailySchedule;
//# sourceMappingURL=DailySchedule.js.map