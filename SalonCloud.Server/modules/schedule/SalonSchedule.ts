/**
 * 
 * 
 */
<<<<<<< HEAD
import {ScheduleBehavior} from './ScheduleBehavior';
//import {Schedule} from './models/Schedule';
//import {DailyScheduleModel} from './models/DailyScheduleModel';
import {ScheduleModel, DailyScheduleModel} from './ScheduleModel';
//import {WeeklyScheduleProfile} from './models/WeeklyScheduleModel';
import {WeeklyScheduleData, DailyScheduleData} from './ScheduleData';
import * as mongoose from "mongoose";
var ErrorMessage = require('./../../routes/ErrorMessage')
var Validator = require('./../../core/validator/Validator')

=======
>>>>>>> origin/master

import { mongoose } from "../../services/database";
import { Schedule } from "./Schedule";
import { DailyScheduleData, WeeklyScheduleData } from "./ScheduleData";
import { ScheduleModel } from "./ScheduleModel";
export class SalonSchedule extends Schedule {
    protected addDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }

<<<<<<< HEAD
export class SalonSchedule implements ScheduleBehavior {

    /**
     * name
     */
    constructor(){

    };
    public getSchedule(startDate: Date, endDate: Date, callback): [DailyScheduleData] {
        if (startDate == null) {
            callback(ErrorMessage.MissingStartDate, 400, undefined);
            return null;
        } 

        if (Validator.IsValidDate(startDate) == false) {
            callback(ErrorMessage.InvalidStartDate, 400, undefined);
            return null;
        }

        if (endDate == null) {
            callback(ErrorMessage.MissingEndDate, 400, undefined);
            return null;
        } 

        if (Validator.IsValidDate(endDate) == false) {
            callback(ErrorMessage.InvalidEndDate, 400, undefined);
            return null;
        }

        if (startDate.getTime() > endDate.getTime()) {
            callback(ErrorMessage.InvalidEndDateForStartDate, 400, undefined);
            return null;
        }

        let dateRangeCondition = {date: { $gte: startDate, $lt: endDate}};
        DailyScheduleModel.find(dateRangeCondition, function(err, dailySchedules) {
            if (err) {
                // ToDo: throw error
                callback(ErrorMessage.ServerError, 500, undefined);
                return null;
            }

            return dailySchedules;
        })

        return undefined;
=======
    protected addWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean{
        return true;
>>>>>>> origin/master
    }

    protected checkDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }
    protected checkWeeklySchedule(salonId: String): boolean{
        return true;
    }

    protected getDailyScheduleRecord(date: Date): DailyScheduleData {
        var dailySchedule: DailyScheduleData;
        return dailySchedule;
    }

    protected getWeeklyScheduleRecord(): [WeeklyScheduleData] {
        var weeklyScheduleList: [WeeklyScheduleData];

        return weeklyScheduleList;
    }

    protected normalizeDailySchedule(dailySchedule: DailyScheduleData): DailyScheduleData {
        return dailySchedule;
    }

    protected updateDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }
    
    protected updateWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean {
        return true;
    }
}