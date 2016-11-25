/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import * as moment from 'moment';
import { SalonTimeData } from './SalonTimeData';
export class SalonTime {
    private momentObject: moment.Moment;
    constructor(salonTime: SalonTimeData) {
        var timeString: string = salonTime.year + '-' + (salonTime.month+1) + '-' + 
                                 salonTime.day + ' ' + (salonTime.hour) + ':' + salonTime.min;
        this.momentObject = moment(timeString);
        var test = moment(timeString,'YYYY-MM-DD HH:MM');

        console.log('TEST 1: ', this.momentObject);
        console.log('TEST 2: ', test);
    }
    
    static stringToSalonTimeData(dateString: string){

        //validation;


        var year = +dateString.substring(0,3);
        var month = +dateString.substring(5,6);
        var day = +dateString.substring(8,9);
        var hour = +dateString.substring(11,12);
        var minute = +dateString.substring(14,15);

        var salonTime: SalonTimeData = {
            year: year,
            month: month,
            day: day,
            hour: hour,
            min: minute
        }
        return salonTime;

    }

    static dateToSalonTimeData(date: Date){
        var salonTime: SalonTimeData = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            hour: date.getHours(),
            min: date.getMinutes(),
        }
    }

    public addMinute(minute: number) {
        this.momentObject.add(minute, 'minutes');

    }

    public addHour(hour: number) {
        this.momentObject.add(hour, 'hours');
    }

    public addDay(day: number){
        this.momentObject.add(day, 'days');
    }

    public addMonth(month: number){
        this.momentObject.add(month, 'months');
    }

    public addYear(year: number){
        this.momentObject.add(year, 'years');
    }

    public setMinute(minute: number) {
        this.momentObject.minute(minute);
    }

    public setHour(hour: number) {
        this.momentObject.hour(hour);
    }

    public setDay(day: number) {
        this.momentObject.day(day);
    }

    public setMonth(month: number) {
        this.momentObject.month(month);
    }

    public setYear(year: number) {
        return this.momentObject.year();
    }

    public getMinute() {
        return this.momentObject.minute();
    }

    public getHour() {
        return this.momentObject.hour();
    }

    public getDay() {
        return this.momentObject.day();
    }

    public getMonth() {
        return this.momentObject.month();
    }

    public getYear() {
        return this.momentObject.year();
    }

    public toSalonTime():SalonTimeData{
        var returnData: SalonTimeData = {
            min: this.momentObject.minute(),
            hour: this.momentObject.hour(),
            day: this.momentObject.date(),
            month: this.momentObject.month(),
            year: this.momentObject.year()
        }
        
        return returnData;
    }
}