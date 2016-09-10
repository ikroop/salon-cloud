/**
 * 
 * 
 */
import { ScheduleBehavior } from './ScheduleBehavior';
import {DailyScheduleModel} from './ScheduleModel';
// import {WeeklyScheduleModel, WeeklyScheduleProfile} from './ScheduleModel';
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
    public insertWeekly(salonId: string, schedule: WeeklyScheduleData, callback) {

    }

    /**
     * name
     */
    public insertDaily(schedule: DailyScheduleData, callback) {

    }

   
   
}