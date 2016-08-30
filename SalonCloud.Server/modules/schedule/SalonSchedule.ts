/**
 * 
 * 
 * 
 * 
 * 
 */
import {ScheduleBehavior} from './ScheduleBehavior';
//import {Schedule} from './models/Schedule';
//import {DailyScheduleModel} from './models/DailyScheduleModel';
import {ScheduleModel} from './ScheduleModel';
//import {WeeklyScheduleProfile} from './models/WeeklyScheduleModel';
import {WeeklyScheduleData, DailyScheduleData} from './ScheduleData';
import * as mongoose from "mongoose";
var ErrorMessage = require('./../../routes/ErrorMessage')


export const WeeklyScheduleSchema = new mongoose.Schema(
    {
        salon_id: {type: String, required: true},
        close: {type: Number, required: true},
        open: {type: Number, required: true},
        status: {type: Boolean, required: true},
        dayofweek: {type: Number, required: true},
    }
);

export class SalonSchedule implements ScheduleBehavior {

    /**
     * name
     */
    constructor(){

    };
    public getSchedule(startDate: Date, endDate: Date, callback): [DailyScheduleData] {
        // DailyScheduleModel.
        // Bear.findById(req.params.bear_id, function(err, bear) {
        //     if (err)
        //         res.send(err);
        //     res.json(bear);
        // });
        
        //COMMENTED BY DUE NGUYEN
        //DailyScheduleModel.create()
        return undefined;
    }

    /**
     * name
     */
    public getWeeklySchedule(callback): [WeeklyScheduleData] {
        return undefined;
    }

    /**
     * name
     */
    public insertWeekly(salonId: string, schedules: Array<WeeklyScheduleData>, callback) {

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
            if(!schedules[i].open){
                callback(ErrorMessage.MissingScheduleOpenTime, 400, undefined);
                console.log(3);
                return;
            }
            if(!schedules[i].close){
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
        }



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
                        weekly: schedules,
                        daily: undefined
                    },
                    employee: undefined
                };
                ScheduleModel.create(newSchedule, function(err, newSchedule){
                    if(err){
                        callback(ErrorMessage.ServerError, 500, undefined);
                        return;
                    }else {
                        callback(undefined, 200, schedules);
                        return;
                    }
                })

            }else{
                console.log('KKKKKK'+ docs.salon.weekly[0]);
                console.log('HHHHHHH' + schedules[0]);
                docs.salon.weekly = schedules;
                /*for(var i=0; i<=6; i++){
                    docs.salon.weekly[i] = schedules[i];
                }*/
                console.log('HHHHHHHOOOOOO' + schedules[0]);
                console.log('KKKKKKOOOOO'+ docs.salon.weekly[0]);
                docs.save(function(err){
                    if(err){
                        callback(err, 500, undefined);
                        return;
                    }else{
                        callback(undefined, 200, schedules);
                        return;
                    }
                });
                
            }
        });
        
    }

    /**
     * name
     */
    public insertDaily(schedule: DailyScheduleData, callback) {

    }

    
}