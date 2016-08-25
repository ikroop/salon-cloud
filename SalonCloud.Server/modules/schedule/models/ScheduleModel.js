"use strict";
const mongoose = require("mongoose");
exports.ScheduleSchema = new mongoose.Schema({
    id: { type: String, required: true },
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true }
});
exports.ScheduleModel = mongoose.model('ScheduleData', exports.ScheduleSchema);
class Schedule {
}
exports.Schedule = Schedule;
//# sourceMappingURL=ScheduleModel.js.map