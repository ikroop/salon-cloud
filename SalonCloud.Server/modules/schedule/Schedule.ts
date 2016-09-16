/*
 *
 *
 */
import { DailyScheduleData, WeeklyScheduleData, DailyDayData, WeeklyDayData } from './ScheduleData';
import {SalonCloudResponse} from "../../core/SalonCloudResponse";
import {ScheduleBehavior} from "./ScheduleBehavior";
import {WeeklyScheduleModel, DailyScheduleModel} from "./ScheduleModel";
var ErrorMessage = require('./../../core/ErrorMessage');
import {BaseValidator} from "./../../core/validation/BaseValidator";
import {MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId}
 from "./../../core/validation/ValidationDecorators";

export abstract class Schedule implements ScheduleBehavior {
	/**
     * getDailySchedule
	 *
     */
    public getDailySchedule(date: Date): SalonCloudResponse<DailyDayData> {
        var response: SalonCloudResponse<DailyDayData>;
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
    public getWeeklySchedule(): SalonCloudResponse<[WeeklyDayData]> {
        var response: SalonCloudResponse<[WeeklyDayData]>;
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
    public getMonthlySchedule(month: number, year: number): SalonCloudResponse<[DailyDayData]> {
        var response: SalonCloudResponse<[DailyDayData]>;
        //TODO: use getDailyScheduleRecord(date)

        return response;
    }

    public async saveDailySchedule(dailySchedule: DailyDayData){

        var response: SalonCloudResponse<boolean>={
            code: undefined,
            data: undefined,
            err: undefined
        };
        var saveStatus;

        //validation
        var errorReturn = await this.dailyScheduleValidation(dailySchedule);
        if(errorReturn){
            response.code = 400;
            response.err = errorReturn;
            return response;
        }

        //check docs existence: yes>>>> process update, no>>>>> process add
        var k = await this.checkDailySchedule(dailySchedule);
        if(k.err){
            saveStatus = undefined;
        }else{
            if (k.data) {
                saveStatus = await this.updateDailySchedule(dailySchedule);
                console.log('1',saveStatus );
          } else {
                saveStatus = await this.addDailySchedule(dailySchedule);
                console.log('2',saveStatus );
            }
        }
        response.data = saveStatus.data;
        console.log('rrrre', response);

        if (!saveStatus.err){
            console.log('200', saveStatus);
            response.code = 200;
            response.err = undefined;
        }else{
            console.log('500', saveStatus);
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        console.log('rrrr', response);
        

        return response;
    }
    /**
     * name
     */
    public async saveWeeklySchedule(weeklyScheduleList: [WeeklyDayData]){

        var response: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

        var saveStatus;

        //validation
        var errorReturn = await this.weeklyScheduleValidation(weeklyScheduleList);
        if(errorReturn){
            response.code = 400;
            response.err = errorReturn;
            return response;
        }
        console.log('3');
        //check docs existence: yes>>>process update, no>>>> procee add
        var k = await this.checkWeeklySchedule();
        console.log('4', k)
        if(k.err){
            saveStatus = undefined;
        }else{
            if (k.data) {
            saveStatus = await this.updateWeeklySchedule(weeklyScheduleList);
            console.log('5', saveStatus);
        } else {
            saveStatus = await this.addWeeklySchedule(weeklyScheduleList);
            console.log('6', saveStatus);
        }
        }
        
        response.data = saveStatus.data;
        if (!saveStatus.err){
            response.code = 200;
            response.err = undefined;
        }else{
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        

        return response;
        

    }

   
    

    protected abstract addDailySchedule(dailySchedule: DailyDayData);
    protected abstract addWeeklySchedule(weeklyScheduleList: [WeeklyDayData]);
    protected abstract checkDailySchedule(dailySchedule: DailyDayData);
    protected abstract checkWeeklySchedule();
    protected abstract getDailyScheduleRecord(date: Date): DailyDayData;
    protected abstract getWeeklyScheduleRecord(): [WeeklyDayData];
    protected abstract normalizeDailySchedule(dailySchedule: DailyDayData): DailyDayData;
    protected abstract updateDailySchedule(dailySchedule: DailyDayData);
    protected abstract updateWeeklySchedule(weeklyScheduleList: [WeeklyDayData]);
    protected abstract weeklyScheduleValidation(weeklyScheduleList: [WeeklyDayData]);
    protected abstract dailyScheduleValidation(dailySchedule: DailyDayData);

}