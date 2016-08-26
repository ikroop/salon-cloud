import { ScheduleBehavior } from './ScheduleBehavior';
import {Schedule} from './models/Schedule';
import {DailyScheduleModel} from './models/DailyScheduleModel';
import {WeeklyScheduleModel} from './models/WeeklyScheduleModel';
import {WeeklyScheduleProfile} from './models/WeeklyScheduleModel';
import {DailySchedule} from './models/DailySchedule';
import {WeeklySchedule} from './models/WeeklySchedule';
import * as mongoose from "mongoose";
var ErrorMessage = require('./../../routes/ErrorMessage')


export const WeeklyScheduleSchema = new mongoose.Schema(
    {
        salon_id: {type: String, required: true},
        close: {type: Number, required: true},
        open: {type: Number, required: true},
        status: {type: Boolean, required: true},
        dayofweek: {type: Number, required: true},
    }
);

export class SalonSchedule extends ScheduleBehavior {

    /**
     * name
     */
    public getSchedule(startDate: Date, endDate: Date, callback): [DailySchedule] {
        // DailyScheduleModel.
        // Bear.findById(req.params.bear_id, function(err, bear) {
        //     if (err)
        //         res.send(err);
        //     res.json(bear);
        // });
        DailyScheduleModel.create()
        return undefined;
    }

    /**
     * name
     */
    public getWeeklySchedule(callback): [WeeklySchedule] {
        return undefined;
    }

    /**
     * name
     */
    public insertWeekly(schedule: WeeklySchedule, callback) {
        let weeklyScheduleProfile = schedule.exportProfile() as WeeklyScheduleProfile;
        WeeklyScheduleModel.create(weeklyScheduleProfile, function(err: any, salonSchedule: WeeklyScheduleProfile){
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            } else {
                console.log('why not?');
                callback(undefined, 200, salonSchedule);
            }
        });
    }

    /**
     * name
     */
    public insertDaily(schedule: DailySchedule, callback) {

    }

    /**
     * name
     */
    public validate(schedule: Schedule, callback) {

    }
}