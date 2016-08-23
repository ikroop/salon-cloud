"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mongoose = require("mongoose");
var ScheduleData_1 = require('./ScheduleData');
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
var DailySchedule = (function (_super) {
    __extends(DailySchedule, _super);
    function DailySchedule() {
        _super.apply(this, arguments);
    }
    return DailySchedule;
}(ScheduleData_1.Schedule));
exports.DailySchedule = DailySchedule;
