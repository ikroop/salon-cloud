"use strict";
var mongoose = require("mongoose");
// import {UserProfileSchema} from '../../user/UserProfile';
exports.ScheduleDataSchema = new mongoose.Schema({
    id: { type: String, required: true },
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true }
});
exports.ScheduleDataModel = mongoose.model('ScheduleData', exports.ScheduleDataSchema);
var Schedule = (function () {
    function Schedule() {
    }
    return Schedule;
}());
exports.Schedule = Schedule;
