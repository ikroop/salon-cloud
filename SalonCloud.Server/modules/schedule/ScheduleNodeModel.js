"use strict";
//
//
//
//
//
//
const mongoose = require("mongoose");
const DailyScheduleModel_1 = require('./models/DailyScheduleModel');
const WeeklyScheduleModel_1 = require('./models/WeeklyScheduleModel');
exports.ScheduleNodeSchema = new mongoose.Schema({
    salon: {
        salon_id: { type: String, required: true },
        weekly: { type: [WeeklyScheduleModel_1.WeeklyScheduleSchema], required: true },
        daily: { type: [DailyScheduleModel_1.DailyScheduleSchema], required: true }
    },
    emplopyee: {
        employee_id: { type: String, required: true },
        salon_id: { type: String, required: true },
        weekly: { type: [WeeklyScheduleModel_1.WeeklyScheduleSchema], required: true },
        daily: { type: [DailyScheduleModel_1.DailyScheduleSchema], required: true }
    }
});
exports.ScheduleNodeModel = mongoose.model('Schedule', exports.ScheduleNodeSchema);
//# sourceMappingURL=ScheduleNodeModel.js.map