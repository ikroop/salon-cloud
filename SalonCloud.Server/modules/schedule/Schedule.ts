/*
 *
 *
 */
import { DailyScheduleData, WeeklyScheduleData } from './ScheduleData';
import {SalonCloudResponse} from "../../core/SalonCloudResponse";
import {ScheduleBehavior} from "./ScheduleBehavior";
import {ScheduleModel} from "./ScheduleModel";
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
    public saveWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData], callback) {

        var response: SalonCloudResponse<boolean>;
        var saveStatus;

        //TODO: implement validation
        /*if (this.checkWeeklySchedule(weeklyScheduleList[1]._id)) {
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
        */

        this.checkWeeklySchedule(weeklyScheduleList[1]._id, function(error, data){
            if(error){
                callback(error, 500, undefined);
                return;
            }else if(data==true){
                this.updateWeeklySchedule(weeklyScheduleList, function(error, returnData){
                    if(error){
                        callback(error, 500, undefined);
                        return;
                    }else{
                        callback(undefined, 200, returnData);
                        return;
                    }
                });
            }else{
                this.addWeeklySchedule(weeklyScheduleList, function(error, returnData){
                    if(error){
                        callback(error, 500, undefined);
                        return;
                    }else{
                        callback(undefined, 200, returnData);
                        return;
                    }
                });
            }
        })
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
    protected abstract addWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean;
    protected abstract checkDailySchedule(dailySchedule: DailyScheduleData): boolean;
    protected abstract checkWeeklySchedule(salonId: String, callback);
    protected abstract getDailyScheduleRecord(date: Date): DailyScheduleData;
    protected abstract getWeeklyScheduleRecord(): [WeeklyScheduleData];
    protected abstract normalizeDailySchedule(dailySchedule: DailyScheduleData): DailyScheduleData;
    protected abstract updateDailySchedule(dailySchedule: DailyScheduleData): boolean;
    protected abstract updateWeeklySchedule(weeklyScheduleList: [WeeklyScheduleData]): boolean;
}