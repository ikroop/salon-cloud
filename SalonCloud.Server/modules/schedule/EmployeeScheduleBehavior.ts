/**
 * 
 * 
 */
import { ScheduleBehavior } from './ScheduleBehavior';
import {Schedule} from './models/ScheduleModel';
import {DailyScheduleModel, DailySchedule} from './models/DailyScheduleModel';
import {WeeklyScheduleModel, WeeklySchedule} from './models/WeeklyScheduleModel';
import * as mongoose from "mongoose";

export class EmployeeSchedule implements ScheduleBehavior {
    /**
     * name
     */
    public getSchedule(startDate: Date, endDate: Date): [DailySchedule] {
        return undefined;
    }

    /**
     * name
     */
    public getWeeklySchedule(): [WeeklySchedule] {
        return undefined;
    }

    /**
     * name
     */
    public insert(schedule: Schedule) {

    }

    /**
     * name
     */
    public validate(schedule: Schedule) {

    }
}