"use strict";
const mongoose = require("mongoose");
exports.WeeklyScheduleSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    day_of_week: { type: Number, required: true }
}, {
    _id: false,
    timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
});
exports.DailyScheduleSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    date: { type: Date, required: true }
}, {
    _id: false,
    timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
});
exports.ScheduleSchema = new mongoose.Schema({
    _id: String,
    salon: {
        weekly: [exports.WeeklyScheduleSchema],
        daily: [exports.DailyScheduleSchema]
    },
    employee: [{
            employee_id: { type: String, required: true },
            weekly: [exports.WeeklyScheduleSchema],
            daily: [exports.DailyScheduleSchema]
        }]
}, {
    _id: false,
    timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
});
exports.ScheduleModel = mongoose.model('Schedule', exports.ScheduleSchema);
//# sourceMappingURL=ScheduleModel.js.map