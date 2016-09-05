"use strict";
const Schedule_1 = require("./Schedule");
class SalonSchedule extends Schedule_1.Schedule {
    addDailySchedule(dailySchedule) {
        return false;
    }
    addWeeklySchedule(weeklyScheduleList) {
        return false;
    }
    checkDailySchedule(dailySchedule) {
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
    checkWeeklySchedule() {
        return false;
    }
    getDailyScheduleRecord(date) {
        var dailySchedule;
        return dailySchedule;
    }
    getWeeklyScheduleRecord() {
        var weeklyScheduleList;
        return weeklyScheduleList;
    }
    normalizeDailySchedule(dailySchedule) {
        return dailySchedule;
    }
    updateDailySchedule(dailySchedule) {
        return false;
    }
    updateWeeklySchedule(weeklyScheduleList) {
        return false;
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonSchedule.js.map