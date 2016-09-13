"use strict";
const database_1 = require("../../services/database");
exports.WeeklyScheduleSchema = new database_1.mongoose.Schema({
    _id: { type: String, required: true },
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    day_of_week: { type: Number, required: true }
}, {
    _id: false,
    timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
});
exports.DailyScheduleSchema = new database_1.mongoose.Schema({
    _id: { type: String, required: true },
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    date: { type: Date, required: true }
}, {
    _id: false,
    timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
});
exports.DailyScheduleModel = database_1.mongoose.model('DailySchedule', exports.DailyScheduleSchema);
exports.ScheduleSchema = new database_1.mongoose.Schema({
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
exports.ScheduleModel = database_1.mongoose.model('Schedule', exports.ScheduleSchema);
//# sourceMappingURL=ScheduleModel.js.map