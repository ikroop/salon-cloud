/**
 * 
 * 
 */
import { ScheduleBehavior } from './ScheduleBehavior';
//import {Schedule} from './models/Schedule';
import {DailyScheduleModel, DailyScheduleProfile} from './models/DailyScheduleModel';
import {WeeklyScheduleModel, WeeklyScheduleProfile} from './models/WeeklyScheduleModel';
import {DailyScheduleData} from './ScheduleData';
import {WeeklyScheduleData} from './ScheduleData';
import * as mongoose from "mongoose";

export class EmployeeSchedule implements ScheduleBehavior {
    /**
     * name
     */
    public getSchedule(startDate: Date, endDate: Date, callback): [DailyScheduleData] {
        return undefined;
    }

    /**
     * name
     */
    public getWeeklySchedule(callback): [WeeklyScheduleData] {
        return undefined;
    }

    /**
     * name
     */
    public insertWeekly(schedule: WeeklyScheduleData, callback) {

    }

    /**
     * name
     */
    public insertDaily(schedule: DailyScheduleData, callback) {

    }

   
   
}