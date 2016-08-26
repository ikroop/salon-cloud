/**
 * 
 * 
 */
import { ScheduleBehavior } from './ScheduleBehavior';
import {Schedule} from './models/Schedule';
import {DailyScheduleModel, DailyScheduleProfile} from './models/DailyScheduleModel';
import {WeeklyScheduleModel, WeeklyScheduleProfile} from './models/WeeklyScheduleModel';
import {DailySchedule} from './models/DailySchedule';
import {WeeklySchedule} from './models/WeeklySchedule';
import * as mongoose from "mongoose";

export class EmployeeSchedule extends ScheduleBehavior {
    /**
     * name
     */
    public getSchedule(startDate: Date, endDate: Date, callback): [DailySchedule] {
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