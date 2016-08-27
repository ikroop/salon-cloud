import * as mongoose from "mongoose";
import {ScheduleData} from './ScheduleData'
// import {UserProfileSchema} from '../../user/UserProfile';

export interface ScheduleProfile{
    _id?: string,
    salon_id: string,
    // employee_id: string,
    // created_date: Date,
    // last_modified: Date,
    // created_by: <UserProfile>,
    close: number,
    open: number,
    status: boolean
}



export const WeeklyScheduleSchema = new mongoose.Schema({
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: {type: Number, required: true},
    open: {type: Number, required: true},
    status: {type: Boolean, required: true},
    day_of_week: {type: Number, required: true}
},{
    timestamps: {created_at: 'created_at', modified_at: 'modified_at'}
});

export const DailyScheduleSchema = new mongoose.Schema({
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: {type: Number, required: true},
    open: {type: Number, required: true},
    status: {type: Boolean, required: true},
    date: {type: Date, required: true}
}, {
    timestamps: {created_at: 'created_at', modified_at: 'modified_at'}
});

export const ScheduleSchema = new mongoose.Schema({
    _id: String, //<salon_id>
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: {type: Number, required: true},
    open: {type: Number, required: true},
    status: {type: Boolean, required: true},
    salon:{
        weekly: [WeeklyScheduleSchema],
        daily: [DailyScheduleSchema]
    },
    employee:[{
        employee_id: { type: String, required: true },
        weekly: [WeeklyScheduleSchema],
        daily: [DailyScheduleSchema]
    }]
},{
    _id: false,
    timestamps: {created_at: 'created_at', modified_at: 'modified_at'}
});
export const ScheduleModel = mongoose.model<ScheduleData>('ScheduleData', ScheduleSchema);