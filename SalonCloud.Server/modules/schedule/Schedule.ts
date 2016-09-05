/*
 *
 *
 */
import { DailyScheduleData, WeeklyScheduleData } from './ScheduleData';
import {SalonCloudResponse} from "../../core/SalonCloudResponse";
import {ScheduleBehavior} from "./ScheduleBehavior";
var ErrorMessage = require('./../../routes/ErrorMessage');

export abstract class Schedule implements ScheduleBehavior {
	/**
     * getDailySchedule
	 *
     */
    public getDailySchedule(date: Date): SalonCloudResponse<DailyScheduleData> {
        var response: SalonCloudResponse<DailyScheduleData>;
        //TODO: implement validation

        var dailySchedule = this.getDailyScheduleRecord(date);
        if (!dailySchedule) {
            var weeklySchedule = this.getWeeklyScheduleRecord();

            //TODO: get dailySchedule from weeklySchedule
        }
        if (dailySchedule) {
            dailySchedule = this.normalizeDailySchedule(dailySchedule);
            response.err = undefined;
            response.data = dailySchedule;
            response.code = 200;
        } else {
            response.err = ErrorMessage.ServerError;
            response.data = undefined;
            response.code = 500;
        }

        return response;
    }

    /**
      * name
      */
    public getWeeklySchedule(): SalonCloudResponse<[WeeklyScheduleData]> {
        var response: SalonCloudResponse<[WeeklyScheduleData]>;
        //TODO: implement validation

        var weeklySchedule = this.getWeeklyScheduleRecord();
        if (weeklySchedule) {
            response.err = undefined;
            response.code = 200;
            response.data = weeklySchedule;
        } else {
            response.err = ErrorMessage.ServerError;
            response.code = 500;
            response.data = undefined;
        }
        return response;
    }

	/**
	*
	*/
    public getMonthlySchedule(month: number, year: number): SalonCloudResponse<[DailyScheduleData]> {
        var response: SalonCloudResponse<[DailyScheduleData]>;
        //TODO: use getDailyScheduleRecord(date)

        return response;
    }


    /**
     * name
     */
    public saveWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): SalonCloudResponse<boolean> {

        var response: SalonCloudResponse<boolean>;
        var saveStatus;

        //TODO: implement validation
        if (this.checkWeeklySchedule()) {
            saveStatus = this.updateWeeklySchedule(weeklyScheduleList);
        } else {
            saveStatus = this.addWeeklySchedule(weeklyScheduleList);
        }
        response.data = saveStatus;
        if (saveStatus){
            response.code = 200;
            response.err = undefined;
        }else{
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }

        return response;
    }

    /**
     * name
     */
    public saveDailySchedule(dailySchedule: DailyScheduleData): SalonCloudResponse<boolean> {

        var response: SalonCloudResponse<boolean>;
        var saveStatus;

        //TODO: implement validation
        if (this.checkDailySchedule(dailySchedule)) {
            saveStatus = this.updateDailySchedule(dailySchedule);
        } else {
            saveStatus = this.addDailySchedule(dailySchedule);
        }
        response.data = saveStatus;
        if (saveStatus){
            response.code = 200;
            response.err = undefined;
        }else{
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }

        return response;
    }

    protected abstract addDailySchedule(dailySchedule: DailyScheduleData): boolean;
    protected abstract addWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean;
    protected abstract checkDailySchedule(dailySchedule: DailyScheduleData): boolean;
    protected abstract checkWeeklySchedule(): boolean;
    protected abstract getDailyScheduleRecord(date: Date): DailyScheduleData;
    protected abstract getWeeklyScheduleRecord(): [WeeklyScheduleData];
    protected abstract normalizeDailySchedule(dailySchedule: DailyScheduleData): DailyScheduleData;
    protected abstract updateDailySchedule(dailySchedule: DailyScheduleData): boolean;
    protected abstract updateWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean;
}