/**
 * 
 * 
 * 
 * 
 * 
 * 
 */
import * as moment from 'moment';
import { SalonTimeData } from './SalonTimeData';
export class SalonTime {
    private momentObject: moment.Moment;
    constructor(salonTime: SalonTimeData) {
        var timeString: string = salonTime.year + '-' + salonTime.month + '-' + 
                                 salonTime.day + ' ' + salonTime.hour + ':' + salonTime.min;
        this.momentObject = moment(timeString, 'YYYY-MM-DD HH:MM');
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
        this.momentObject.year(year);
    }

    public toSalonTime():SalonTimeData{
        var returnData: SalonTimeData = {
            min: this.momentObject.minute(),
            hour: this.momentObject.hour(),
            day: this.momentObject.day(),
            month: this.momentObject.month(),
            year: this.momentObject.year()
        }
        
        return returnData;
    }
}