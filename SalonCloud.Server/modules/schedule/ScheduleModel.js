"use strict";
const database_1 = require("../../services/database");
exports.WeeklyDaySchema = new database_1.mongoose.Schema({
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    day_of_week: { type: Number, required: true }
}, {
    timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
});
exports.DailyDaySchema = new database_1.mongoose.Schema({
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    date: { type: Date, required: true }
}, {
    timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
});
exports.WeeklyScheduleSchema = new database_1.mongoose.Schema({
    salon_id: String,
    employee_id: String,
    week: [exports.WeeklyDaySchema],
}, {
    timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
});
exports.DailyScheduleSchema = new database_1.mongoose.Schema({
    salon_id: String,
    employee_id: String,
    day: exports.DailyDaySchema,
});
exports.WeeklyScheduleModel = database_1.mongoose.model('WeeklySchedule', exports.WeeklyScheduleSchema);
exports.DailyScheduleModel = database_1.mongoose.model('DailySchedule', exports.DailyScheduleSchema);
//# sourceMappingURL=ScheduleModel.js.map