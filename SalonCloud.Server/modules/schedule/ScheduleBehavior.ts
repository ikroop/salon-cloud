//
//
//
//
//
//
import { Schedule } from './models/ScheduleModel';
import { DailySchedule } from './models/DailyScheduleModel';
import { WeeklySchedule } from './models/WeeklyScheduleModel';

export interface ScheduleBehavior{
    /**
     * name
     */
    getSchedule(startDate: Date, endDate: Date): [DailySchedule];

    /**
     * name
     */
    getWeeklySchedule(): [WeeklySchedule];

    /**
     * name
     */
    insert(schedule: Schedule);

    /**
     * name
     */
    validate(schedule: Schedule);
}