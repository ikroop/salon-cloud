/**
 * 
 * 
 * 
 * 
 */

import { AppointmentManagement } from './AppointmentManagement'
import { AppointmentData } from './AppointmentData'
import { SalonCloudResponse } from './../../core/SalonCloudResponse'
import { AppointmentBehavior } from './AppointmentBehavior';
import { SalonTimeData } from './../../Core/salonTime/SalonTimeData'
import { SalonTime } from './../../Core/salonTime/SalonTime'

export abstract class AppointmentAbstract implements AppointmentBehavior {
    private appointmentManagementDP: AppointmentManagement;

    public cancelAppointment(appointmentId: string) {
        return;
    };

    public async createAppointment(appointment: AppointmentData): Promise<SalonCloudResponse<AppointmentData>> {
        var response: SalonCloudResponse<AppointmentData> = {
            data: undefined,
            code: undefined,
            err: undefined
        }

        var validationResult = this.validation(appointment);

        //Normalization Data
        var newAppointment = this.normalizationData(appointment);

        // Create appointment document
        //var result = this.createAppointmentDoc(appointment);

        var result = await this.appointmentManagementDP.createAppointment(newAppointment);
        if (result.err) {
            response.err = result.err;
            response.code = result.code;
            return response;
        }

        return response;
    };

    public updateAppointment(appointmentId: string, appointment: AppointmentData) {
        return;
    };

    public updateAppointmentStatus(appointmentId: string, status: number) {
        return
    };

    public checkBookingAvailableTimes(appointment: AppointmentData) {

        return;
    }

    private createAppointmentDoc(appointment: AppointmentData) {

    }

    public getAvailableTime(imeNeeded: number, date: Date) {

        // get employee list with open and close time;

        // init the result array

        // run loop method getEmployeeAvailableTime for each employee, push result to result array;

        // return
    }

    public getEmployeeAvailableTime(timeNeeded: number, date: SalonTimeData, employee: any) {
        var timeArrayLenght = (employee.close - employee.open) / 15 + 1;
        var timeNeededNumberOfTicks = timeNeeded / 15;
        var day = new SalonTime(date);
        var flexibleTime;        // Todo: 




        var openTime = new SalonTime(date);
        openTime.setHour(employee.open / 3600);
        openTime.setMinute(employee.open % 3600 / 60);

        var openTimeData = openTime.toSalonTime();
        var openTimePoint = openTimeData.min + openTimeData.hour * 60;

        var closeTime = new SalonTime(date);
        closeTime.setHour(employee.close / 3600);
        closeTime.setMinute(employee.close % 3600 / 60);

        var closeTimeData = closeTime.toSalonTime();
        var closeTimePoint = closeTimeData.min + closeTimeData.hour * 60;

        // get all employee's appointments in the day;
        var appointmentArray: Array<any>;

        // initilize timArray
        var timeArray: Array<any>;
        for (let i = 0; i < timeArrayLenght; i++) {
            let obj = {
                status: true,
                flexible: false,
                time: openTimePoint + 15 * i,
                touchAppointmentId: null,
            }
            timeArray.push(obj);
        }

        // mark unavailable time point on the timeArray
        /**
         * PROCESS EXPLANATION: 
         * Let's consider each tick is equivalent to 15 minutes, we have the example timeline with 15 ticks.
         * timeArray :  0   1   2   3   4   5   6   7   8   9   10  11  12  13  14   
         *              |---|---|---|---|---|---|---|---|---|---|---|---|---|---|
         * 
         * Example 1: Time needed is 45 minutes (timeNeededNumberOfTicks = 3 ticks).
         *            The appointment time is 4-11. 
         *             and the appointment is already touched by another appointment (flexible flag == true).
         *   Then:
         * leftPoleIndex = startTime - neededTime = 4 - 3 = 1
         * rightPoleIndex = endTime =  11
         * 
         * updated timeArray :   0   1   2   3   4   5   6   7   8   9   10  11  12  13  14   
         *                       |---xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx---|---|---|---|
         * 
         * Notice: 11 is still available.
         * 
         * 
         * Example 2: Time needed is 45 minutes (timeNeededNumberOfTicks = 3 ticks).
         *            The appointmentand time is 4-11, 
         *            and the appointment is not touched by any other appointment (flexible flag == false).
         *            and flexibleTime is 30 ( ==2 ticks).
         *   Then: 
         * leftPoleIndex = startTime + flexibleTimeTicks - neededTime =  4 + 2 - 3 = 6
         * rightPoleIndex = endTime - flexibleTimeTicks = 11 - 2 = 9
         * 
         * updated timeArray : 0   1   2   3   4   5   6   7   8   9   10  11  12  13  14   
         *                     |---|---|---|---|---|---xxxxxxxxx---|---|---|---|---|---|
         * 
         * Notice: 9 is still available.
         * 
         * 
         * Example 3: Time needed is 45 minutes (timeNeededNumberOfTicks = 3 ticks).
         *            The appointmentand time is 4-7, 
         *            and the appointment is not touched by any other appointment (flexible flag == false).
         *            and flexibleTime is 30 ( ==2 ticks).
         *   Then: 
         * leftPoleIndex = startTime + flexibleTimeTicks - neededTime =  4 + 2 - 3 = 6
         * rightPoleIndex = endTime - flexibleTimeTicks = 7 - 2 = 5
         * (leftPoleIndex > rightPoleIndex)>>> no action needed on timeArray except for update flexible fields.
         * 
         * updated timeArray : 0   1   2   3   4   5   6   7   8   9   10  11  12  13  14   
         *                     |---|---|---|---|---|---|---|---|---|---|---|---|---|---|         
         * 
         * */
        if (appointmentArray) {
            // loop appointmentArray to work with each busy appointed time period
            // each appointment run 1 time the explained process.

            //TODO: split into 2 case: touched and not touched
            for (let eachAppointment of appointmentArray) {

                // init leftPoleIndex
                eachAppointment.startPoint = eachAppointment.start.min + eachAppointment.start.hour * 60;
                let leftPoleIndex = (eachAppointment.startPoint - openTimePoint) / 15;

                // init rightPoleIndex
                eachAppointment.endPoint = eachAppointment.end.min + eachAppointment.end.hour * 60;
                let rightPoleIndex = (eachAppointment.endPoint - openTimePoint) / 15;


                // check if the current appointment touched by another appointment and adjust the 'POLEs';
                if (eachAppointment.flexible) {
                    // adjust the poles;
                    leftPoleIndex -= timeNeededNumberOfTicks;
                } else {
                    // adjust the poles;
                    leftPoleIndex = leftPoleIndex - timeNeededNumberOfTicks + flexibleTime / 15;
                    rightPoleIndex = rightPoleIndex - flexibleTime / 15;
                }


                // if leftPoleInded > rightPoleIndex, dont update timeArray;
                // if leftPoleInded<= rightPoleIndex, update timeArray with loop;
                if (leftPoleIndex <= rightPoleIndex) {
                    for (let i = rightPoleIndex - 1; (i >= leftPoleIndex) && (i >= 0); i--) {
                        timeArray[i].status = false;
                    }
                }


                //update flexible field for element in timeArray
                if (eachAppointment.flexible) {
                    for (let i = 1; i <= flexibleTime / 15; i++) {
                        timeArray[i + rightPoleIndex - 1].flexible = true;
                        timeArray[leftPoleIndex - i].flexible = true;
                    }
                }

                //check if lastAvailPeriod should be mark unavailable too or not.
                let lastAvailPeriodTicks = closeTimePoint / 15 - rightPoleIndex;
                if (lastAvailPeriodTicks < timeNeededNumberOfTicks - flexibleTime / 15) {
                    for (let i = rightPoleIndex; i <= closeTimePoint / 15; i++) {
                        timeArray[i].status = false;
                    }
                }


            }
        }





    }

    protected abstract validation(appointment: AppointmentData): SalonCloudResponse<string>;
    protected abstract normalizationData(appointment: AppointmentData): AppointmentData;


}