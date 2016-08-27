// import * as mongoose from "mongoose";
import {ScheduleProfile} from './ScheduleModel';

export interface WeeklyScheduleData{
    // employee_id: string,
    // created_date: Date,
    // last_modified: Date,
    // created_by: <UserProfile>,
    close: number,
    open: number,
    status: boolean,
    day_of_week: number
};

export interface DailyScheduleData{
    // employee_id: string,
    // created_date: Date,
    // last_modified: Date,
    // created_by: <UserProfile>,
    close: number,
    open: number,
    status: boolean,
    date: Date
};

export interface ScheduleData {
    _id: string, //<salon_id>
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: number,
    open: number,
    status: boolean,
    salon:{
        weekly: [WeeklyScheduleData],
        daily: [DailyScheduleData]
    },
    employee:[{
        employee_id: string,
        weekly: [WeeklyScheduleData],
        daily: [DailyScheduleData]
    }]
};


export class Schedule {
    protected id: string;
    protected salon_id: string;
    protected close: number;
    protected open: number;
    protected status: boolean;

    /*
    constructor(public id, public salon_id, public close, public open, public status) {
    }

    createProfile(profileData: UserProfile, callback) {
        UserModel.findOne({ "_id": this.UserId }, function (err, docs) {
            if (err) {
                callback(undefined);
            }
            if (docs) {
                docs.profile.push(profileData);    
                docs.save();
                callback(docs);    
            }
        });
    }*/

    constructor(id: string, salonId: string, close: number, open:number, status: boolean) {
        this.id = id;
        this.salon_id = salonId;
        this.close = close;
        this.open = open;
        this.status = status;
    }

    public exportProfile (): ScheduleProfile {
        let scheduleProfile = {
            _id: this.id,
            salon_id: this.salon_id,
            // employee_id: string,
            // created_date: Date,
            // last_modified: Date,
            // created_by: <UserProfile>,
            close: this.close,
            open: this.open,
            status: this.status
        };

        return scheduleProfile;
    }
}