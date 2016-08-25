import * as mongoose from "mongoose";
// import {UserProfileSchema} from '../../user/UserProfile';

export interface ScheduleProfile{
    id: string,
    // employee_id: string,
    // created_date: Date,
    // last_modified: Date,
    // created_by: <UserProfile>,
    close: number,
    open: number,
    status: boolean
}

export const ScheduleSchema = new mongoose.Schema({
    id: {type: String, required: true},
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: {type: Number, required: true},
    open: {type: Number, required: true},
    status: {type: Boolean, required: true}
});

export const ScheduleModel = mongoose.model('ScheduleData', ScheduleSchema);