import { ScheduleBehavior } from './ScheduleBehavior';
import {Schedule} from './models/Schedule';
import {DailyScheduleModel} from './models/DailyScheduleModel';
import {WeeklyScheduleModel} from './models/WeeklyScheduleModel';
import {DailySchedule} from './models/DailySchedule';
import {WeeklySchedule} from './models/WeeklySchedule';
import * as mongoose from "mongoose";

export class SalonSchedule implements ScheduleBehavior {
    /**
     * name
     */
    public getSchedule(startDate: Date, endDate: Date): [DailySchedule] {
        DailyScheduleModel.create
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