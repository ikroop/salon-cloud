/**
 * 
 * 
 */
/*
import {ScheduleBehavior} from './ScheduleBehavior';
//import {Schedule} from './models/Schedule';
//import {DailyScheduleModel} from './models/DailyScheduleModel';
import {ScheduleModel} from './ScheduleModel';
//import {WeeklyScheduleProfile} from './models/WeeklyScheduleModel';
import {WeeklyScheduleData, DailyScheduleData} from './ScheduleData';
import * as mongoose from "mongoose";
import {Validator} from './../../core/validator/validator';
var ErrorMessage = require('./../../routes/ErrorMessage')


export const WeeklyScheduleSchema = new mongoose.Schema(
    {
        salon_id: {type: String, required: true},
        close: {type: Number, required: true},
        open: {type: Number, required: true},
        status: {type: Boolean, required: true},
        dayofweek: {type: Number, required: true},
*/
import { mongoose } from "../../services/database";
import { Schedule } from "./Schedule";
import { DailyScheduleData, WeeklyScheduleData } from "./ScheduleData";
export class SalonSchedule extends Schedule {
    protected addDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }

    protected addWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean {
        return false;
    }

    protected checkDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }

    /**
     * name
     */
 /*   public insertWeekly(salonId: string, schedules: Array<WeeklyScheduleData>, callback) {

        if(!salonId){
            callback(ErrorMessage.MissingSalonId, 400, undefined);
            console.log(7);

            return;
        }

        if(schedules.length != 7 ){
            callback(ErrorMessage.WrongNumberOfDaysOfWeek, 400, undefined);
            console.log(6);

            return;
        }
        var duplicateCheckList = [];
        for(var i = 0; i <=6; i++){
            if(duplicateCheckList.indexOf(schedules[i]._id)!=-1){
                callback(ErrorMessage.DuplicateDaysOfWeek, 400, undefined);
                console.log(1);
                return;
            }else{
                duplicateCheckList.push(schedules[i]._id);
            }
            if(schedules[i].status==undefined){
                callback(ErrorMessage.MissingScheduleStatus, 400, undefined);
                console.log(2);

                return;
            }
            if(schedules[i].open==undefined){
                callback(ErrorMessage.MissingScheduleOpenTime, 400, undefined);
                console.log(3);
                return;
            }
            if(schedules[i].close==undefined){
                callback(ErrorMessage.MissingScheduleCloseTime, 400, undefined);
                console.log(4);

                return;
            }
            if(schedules[i].day_of_week == undefined){
                console.log(schedules[i]);
                callback(ErrorMessage.MissingScheduleDayOfWeek, 400, undefined);
                console.log(5);
                return;
            }
            if(!Validator.IsValidWeekDay(schedules[i].day_of_week)){
                callback(ErrorMessage.InvalidScheduleDayOfWeek, 400, undefined);
                return;
            }
            if(!Validator.IsValidScheduleTime(schedules[i].open)){
                callback(ErrorMessage.InvalidScheduleOpenTime, 400, undefined);
                return;
            }
            if(!Validator.IsValidScheduleTime(schedules[i].close)){
                callback(ErrorMessage.InvalidScheduleCloseTime, 400, undefined);
                return;
            }
            if(!Validator.IsValidCloseTimeForOpenTime(schedules[i].open, schedules[i].close)){
                callback(ErrorMessage.CloseTimeGreaterThanOpenTime, 400, undefined);
                return;
            }

        }

*/
    protected checkWeeklySchedule(): boolean {
        return false;
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
        return false;
    }
}