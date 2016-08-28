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
    public insertWeekly(salonId: string, schedule: WeeklyScheduleData, callback) {

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
                        weekly: [{
                            _id: schedule.day_of_week,
                            close: schedule.close,
                            open: schedule.open,
                            status: schedule.status,
                            day_of_week: schedule.day_of_week
                        }],
                        daily: undefined
                    },
                    employee: undefined
                };
                ScheduleModel.create(newSchedule, function(err, newSchedule){
                    if(err){
                        callback(ErrorMessage.ServerError, 500, undefined);
                    }else {
                        callback(undefined, 200, schedule);
                    }
                })

            }else{
                var item  = docs.salon.weekly.id(schedule.day_of_week);
                console.log('BOOOOOOOOBBB ' + item);
                var targetSchedule = docs.salon.weekly.filter(function(x){
                    return x._id == schedule.day_of_week;
                });
                /*if(targetSchedule.length == 0){
                    docs.salon.weekly.push(schedule);
                }else{

                }*/
                console.log('CAAAAAAAAACCC'+targetSchedule);
               /*ScheduleModel.findOne({"_id": salonId, "salon.weekly._id": schedule.day_of_week}, function(err, docs){
                    if(err){

                    }else if(!docs){
                        docs.salon.weekly.push(schedule);
                    }else{
                        console.log(docs.salon.weekly);
                    }
                });*/
                /*docs.salon.weekly.id[schedule.day_of_week] = schedule;
                docs.save(function(err){
                    if(err){
                        callback(ErrorMessage.ServerError, 500, undefined);
                    }else {
                        callback(undefined, 200, schedule);
                    }
                })*/
            }
        });
        //COMMENTED BY DUE NGUYENS
        /*let weeklyScheduleProfile = schedule.exportProfile() as WeeklyScheduleProfile;
        WeeklyScheduleModel.create(weeklyScheduleProfile, function(err: any, salonSchedule: WeeklyScheduleProfile){
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            } else {
                console.log('why not?');
                callback(undefined, 200, salonSchedule);
            }
        });*/
    }

    /**
     * name
     */
    public insertDaily(schedule: DailyScheduleData, callback) {

    }

    
}