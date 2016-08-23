"use strict";
const mongoose = require("mongoose");
const DailySchedule_1 = require('./models/DailySchedule');
const WeeklySchedule_1 = require('./models/WeeklySchedule');
exports.ScheduleProfileSchema = new mongoose.Schema({
    salon: {
        salon_id: { type: String, required: true },
        weekly: { type: [WeeklySchedule_1.WeeklyScheduleSchema], required: true },
        daily: { type: [DailySchedule_1.DailyScheduleSchema], required: true }
    },
    emplopyee: {
        employee_id: { type: String, required: true },
        salon_id: { type: String, required: true },
        weekly: { type: [WeeklySchedule_1.WeeklyScheduleSchema], required: true },
        daily: { type: [DailySchedule_1.DailyScheduleSchema], required: true }
    }
});
exports.ScheduleProfileModel = mongoose.model('Schedule', exports.ScheduleProfileSchema);
//# sourceMappingURL=Schedule.js.map