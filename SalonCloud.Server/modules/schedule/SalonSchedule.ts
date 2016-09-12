/**
 * 
 * 
 */

import { mongoose } from "../../services/database";
import { Schedule } from "./Schedule";
import { DailyScheduleData, WeeklyScheduleData } from "./ScheduleData";
import { ScheduleModel } from "./ScheduleModel";
import {SalonCloudResponse} from "../../core/SalonCloudResponse";
var ErrorMessage = require  ("../../core/ErrorMessage");

export class SalonSchedule extends Schedule {
    protected addDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }


    protected async addWeeklySchedule(salonId: String, weeklyScheduleList: [WeeklyScheduleData]){
        /*var k: SalonCloudResponse<boolean>;
        await ScheduleModel.findOne({"_id": salonId}).exec(function(err, docs){
            if(err){
                return k.err = err;
            }else if(!docs){
                //Todo: return error or create default docs;
                return; 
            }else{
                docs.salon.weekly = weeklyScheduleList;
                docs.save(function(err, updatedDocs){
                    if(err){
                       return k.err = err;
                    }else{
                        return k.data = true;
                    }
                })
                return k;
            }

        })

        return k;
        */
        return await this.updateWeeklySchedule(salonId, weeklyScheduleList);
    }

    protected checkDailySchedule(dailySchedule: DailyScheduleData): boolean {
        return false;
    }
    protected async checkWeeklySchedule(salonId: String){
        var k: SalonCloudResponse<boolean> = {
                err: undefined,
                code: undefined,
                data: undefined
            };
        var result = await ScheduleModel.findOne({ "_id": salonId}).exec( function(err, docs){
            if(err){
                return k.err = err;
            }else if(docs){
                if(docs.salon.weekly){
                    return k.data = true; 
                }else{
                    return k.data = false;
                }
            }else{
                //Todo: return error or created default docs;
                return;
            }
        });
        console.log(k);
        return k;
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
    
    protected async updateWeeklySchedule(salonId: String, weeklyScheduleList: [WeeklyScheduleData]){
        var k: SalonCloudResponse<boolean> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var docsFound = await ScheduleModel.findOne({"_id": salonId}).exec();
        
        docsFound.salon.weekly = weeklyScheduleList;

        var saveAction = docsFound.save();
        //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
        await saveAction.then(function(docs){

            k.data = true;

        }, function(err){

            k.err = err;

        })
        return k;
        
    }
}