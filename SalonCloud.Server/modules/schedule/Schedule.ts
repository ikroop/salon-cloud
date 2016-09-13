/*
 *
 *
 */
import { DailyScheduleData, WeeklyScheduleData } from './ScheduleData';
import {SalonCloudResponse} from "../../core/SalonCloudResponse";
import {ScheduleBehavior} from "./ScheduleBehavior";
import {ScheduleModel} from "./ScheduleModel";
var ErrorMessage = require('./../../core/ErrorMessage');
import {BaseValidator} from "./../../core/validation/BaseValidator";
import {MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId}
 from "./../../core/validation/ValidationDecorators";

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
    public async saveWeeklySchedule(salonId: String, weeklyScheduleList: [WeeklyScheduleData]){

        var response: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };

        console.log(salonId, weeklyScheduleList);
        var saveStatus;

        //TODO: implement validation
        var salonIdValidator = new BaseValidator(salonId);
        salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId);
        salonIdValidator = new IsString(salonIdValidator, ErrorMessage.InvalidSalonId);
        //TODO: validate salon Id;
        salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.InvalidSalonId);
        var salonIdResult = await salonIdValidator.validate();
        if(salonIdResult){
            console.log('1', salonIdResult);
            response.err = salonIdResult;
            response.code = 400;
            return response;
        }

        var tempArray:[any] = <any>[];
        for(let i = 0; i<=6; i++){
            var openTimeValidator = new BaseValidator(weeklyScheduleList[i].open);
            openTimeValidator = new MissingCheck(openTimeValidator, ErrorMessage.MissingScheduleOpenTime);
            openTimeValidator = new IsNumber(openTimeValidator,ErrorMessage.InvalidScheduleOpenTime);
            openTimeValidator = new IsInRange(openTimeValidator,ErrorMessage.InvalidScheduleOpenTime, 0, 86400);
            openTimeValidator = new IsLessThan(openTimeValidator, ErrorMessage.OpenTimeGreaterThanCloseTime, weeklyScheduleList[i].close);
            var openTimeResult = openTimeValidator.validate();
            if(openTimeResult){
                console.log('2', openTimeResult);
                response.err = openTimeResult;
                response.code = 400;
                return response;
            }

            var closeTimeValidator = new BaseValidator(weeklyScheduleList[i].close);
            closeTimeValidator = new MissingCheck(closeTimeValidator, ErrorMessage.MissingScheduleCloseTime);
            closeTimeValidator = new IsNumber(closeTimeValidator,ErrorMessage.InvalidScheduleCloseTime);
            closeTimeValidator = new IsInRange(closeTimeValidator,ErrorMessage.InvalidScheduleCloseTime, 0, 86400);
            var closeTimeResult = closeTimeValidator.validate();
            if(closeTimeResult){
                console.log('3', closeTimeResult);
                response.err = openTimeResult;
                response.code = 400;
                return response;
            }

            var dayOfWeekValidator = new BaseValidator(weeklyScheduleList[i].day_of_week);
            dayOfWeekValidator = new MissingCheck(dayOfWeekValidator, ErrorMessage.MissingDayOfWeek);
            dayOfWeekValidator = new IsNumber(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek);
            dayOfWeekValidator = new IsInRange(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek, 0, 6);
            dayOfWeekValidator = new IsNotInArray(dayOfWeekValidator, ErrorMessage.DuplicateDayOfWeek, tempArray);
            var dayOfWeekResult = dayOfWeekValidator.validate();
            if(dayOfWeekResult){
                console.log('4', dayOfWeekResult);
                response.err = dayOfWeekResult;
                response.code = 400;
                return response;
            }

            tempArray.push(weeklyScheduleList[i].day_of_week);




        }

        var k = await this.checkWeeklySchedule(salonId);
        if(k.err){
            saveStatus = undefined;
        }else{
            if (k.data) {
            saveStatus = await this.updateWeeklySchedule(salonId, weeklyScheduleList);
        } else {
            saveStatus = await this.addWeeklySchedule(salonId, weeklyScheduleList);
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
        console.log(saveStatus);
        if (saveStatus){
            response.code = 200;
            response.err = undefined;
        }else{
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }

        return response;
    }

    protected checkScheduleDocsExistence(salonId: String, callback){
        ScheduleModel.findOne({"_id": salonId}, function(err, docs){
            if(err){
                console.log(err);
                callback(ErrorMessage.ServerError, 500, undefined);
            }else if(!docs){
                //ToDo: create default Schedule Docs for Salon
                var newSchedule ={
                    _id: salonId, //<salon_id>
                    // employee_id: {type: String, required: true},
                    // created_date: {type: Date, required: true},
                    // last_modified: {type: Date, required: true},
                    // created_by: {type: UserProfileSchema, required: true},
                    salon:{
                        weekly: undefined,
                        daily: undefined
                    },
                    employee: undefined
                };
                ScheduleModel.create(newSchedule, function(err, newSchedule){
                    if(err){
                        callback(ErrorMessage.ServerError, undefined);
                        return;
                    }else {
                        callback(undefined, newSchedule);
                        return;
                    }
                })

            }else{
                    callback(undefined, docs);
                    return;
            }
        });
    }

    protected abstract addDailySchedule(dailySchedule: DailyScheduleData): boolean;
    protected abstract addWeeklySchedule(salonId: String,weeklyScheduleList: [WeeklyScheduleData]);
    protected abstract checkDailySchedule(dailySchedule: DailyScheduleData): boolean;
    protected abstract checkWeeklySchedule(salonId: String);
    protected abstract getDailyScheduleRecord(date: Date): DailyScheduleData;
    protected abstract getWeeklyScheduleRecord(): [WeeklyScheduleData];
    protected abstract normalizeDailySchedule(dailySchedule: DailyScheduleData): DailyScheduleData;
    protected abstract updateDailySchedule(dailySchedule: DailyScheduleData): boolean;
    protected abstract updateWeeklySchedule(salonId: String, weeklyScheduleList: [WeeklyScheduleData]);
}