"use strict";
const mongoose = require("mongoose");
exports.WeeklyScheduleSchema = new mongoose.Schema({
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    day_of_week: { type: Number, required: true }
}, {
    timestamps: { created_at: 'created_at', modified_at: 'modified_at' }
});
exports.DailyScheduleSchema = new mongoose.Schema({
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    date: { type: Date, required: true }
}, {
    timestamps: { created_at: 'created_at', modified_at: 'modified_at' }
});
exports.ScheduleSchema = new mongoose.Schema({
    _id: String,
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
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
    timestamps: { created_at: 'created_at', modified_at: 'modified_at' }
});
exports.ScheduleModel = mongoose.model('ScheduleData', exports.ScheduleSchema);
//# sourceMappingURL=ScheduleModel.js.map