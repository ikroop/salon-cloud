/**
 * 
 * 
 * 
 * 
 */

import { AppointmentManagement } from './AppointmentManagement'
import { AppointmentData, AppointmentItemData } from './AppointmentData'
import { SalonCloudResponse } from './../../Core/SalonCloudResponse'
import { AppointmentBehavior } from './AppointmentBehavior';
import { SalonTimeData } from './../../Core/SalonTime/SalonTimeData'
import { SalonTime } from './../../Core/SalonTime/SalonTime'
import { EmployeeManagement } from './../UserManagement/EmployeeManagement'
import { SmallestTimeTick } from './../../Core/DefaultData'
import { ServiceManagement } from './../ServiceManagement/ServiceManagement'
import { EmployeeSchedule } from './../Schedule/EmployeeSchedule'


export abstract class AppointmentAbstract implements AppointmentBehavior {
    private appointmentManagementDP: AppointmentManagement;

    public salonId: string;

    constructor(salonId: string, appointmentManagementDP: AppointmentManagement) {
        this.salonId = salonId;
        this.appointmentManagementDP = appointmentManagementDP;
    }

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

        var result: any = await this.appointmentManagementDP.createAppointment(newAppointment);
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
    /**
     * 
     * @name: checkBookingAvailableTimes
     * @param:employee_id: string, service_id: string, start: SalonTime
     * @note: check if an AppointmentItemData is good to be booked
     * @steps: 
     *    1. get service data
     *    2. get timeNeeded
     *    3. employee schedule
     *    4. call getEmployeeAvailableTime, get data from the result
     *    5. return err if time is not available
     *       return AppointmentItemData if time is available
     * 
     * @SalonCloudResponse.data: AppointmentItemData
     *            
     *       
     */
    public async checkBookingAvailableTimes(employeeId: string, serviceId: string, start: SalonTimeData): Promise<SalonCloudResponse<AppointmentItemData>> {
        var response: SalonCloudResponse<AppointmentItemData> = {
            data: undefined,
            code: undefined,
            err: undefined
        }

        // get service data
        var serviceManagementDP = new ServiceManagement(this.salonId);
        var serviceItem = await serviceManagementDP.getServiceItemById(serviceId);
        if(serviceItem.err){
            response.err = serviceItem.err;
            response.code = serviceItem.code;
            return response;
        }
        // get Time needed
        var timeNeeded = serviceItem.data.time;

        // get emloyee schedule
        var scheduleManagementDP = new EmployeeSchedule(this.salonId, employeeId)
        var employeeDaySchedule = scheduleManagementDP.getDailySchedule(start);
        var employee = {
            employee_id: employeeId,
            close: employeeDaySchedule.data.close,
            status: employeeDaySchedule.data.status,
            open: employeeDaySchedule.data.open

        }

        // call getEmployeeAvailableTime, get data from the result
        this.getEmployeeAvailableTime(timeNeeded,start,employee);
        

        // return
        return;
    }

    private createAppointmentDoc(appointment: AppointmentData) {

    }


    /**
     * Ham nay` thua`, co the mai mot can, gio chua can
     * @name: getAvailableTime
     * @param:  timeNeeded: number, date: SalonTimeData
     * @note: This function will get all available time-points for a service  of all employees.
     *        The timeNeeded param is the amount of time that the service requires.
     * @steps: Todo
     * 
     * @SalonCloudResponse.Data: an Array 
     *          [{
     *           employee_id: string,
     *           time_array: [{         //timeArray
     *                          
     *                status: boolean,
     *                time:  number,        //timePoint
     *                overlapped: {         //If booked, this overlapped data will be the appointment' overlapped data
     *                     status: boolean,  
     *                     apointment_id: string
     *                      }         
     *              }]
     *          }]
     * 
     */
    public async getAvailableTime(timeNeeded: number, date: SalonTimeData): Promise<SalonCloudResponse<Array<any>>> {
        var response: SalonCloudResponse<Array<any>> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        // get employee list with open and close time;
        // get all employee
        var EmployeeManagementDP = new EmployeeManagement(this.salonId);
        var employeeList = await EmployeeManagementDP.getAllEmployee();

        // init the result array
        var resultArray: Array<any>;

        // run loop method getEmployeeAvailableTime for each employee, push result to result array;
        for (var each of employeeList) {
            var process = this.getEmployeeAvailableTime(timeNeeded, date, each);
            if (process.err) {

            } else {
                resultArray.push(process.data);
            }
        }
        console.log(employeeList);
        response.data = resultArray;
        response.code = 200;
        // return
        return response;

    }


    /**
    * @name: getEmployeeAvailableTime
    * @param:  timeNeeded: number, date: SalonTimeData, employee: any // expecting 'employee': {status: boolean, close: number, open: number, employeeId: string}  
    * @note: This function will get all available time-points for a service  of 1 employee.
    *        The timeNeeded param is the amount of time that the service requires.
    * @steps: Todo
    * 
    * @SalonCloudResponse.Data: 
    *          { employee_id: string,
    *            time_array: [{         //timeArray
    *                          
    *                status: boolean,
    *                time:  number,        //timePoint
    *                overlapped: {         //If booked, this overlapped data will be the appointment' overlapped data
    *                     status: boolean,  
    *                     apointment_id: string
    *                      }         
    *              }]
    *          }
    * 
    */
    public async getEmployeeAvailableTime(timeNeeded: number, date: SalonTimeData, employee: any) : Promise<SalonCloudResponse<any>> {
        var response: SalonCloudResponse<any> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        var operatingTime = employee.close - employee.open;
        if (operatingTime <= 0 || employee.status == false) {
            response.data = null;
            response.code = 200;
            return response;
        }
        var timeArrayLenght = operatingTime / SmallestTimeTick + 1;

        var timeNeededNumberOfTicks = timeNeeded / SmallestTimeTick;
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
        var appointmentSearch = await this.appointmentManagementDP.getEmployeeAppointmentByDate(employee.employee_id, date);
        if(appointmentSearch.err){
            response.err = appointmentSearch.err;
            response.code = appointmentSearch.code;
            return response;
        }else{
            var appointmentArray = appointmentSearch.data;
        }

        // initilize timArray
        var timeArray: Array<any>;
        for (let i = 0; i < timeArrayLenght; i++) {
            let obj = {
                status: true,
                overlapped: {
                    status: false,
                    appointment_id: null,
                },
                time: openTimePoint + SmallestTimeTick * i,
            }
            timeArray.push(obj);
        }

        // mark unavailable time point on the timeArray
        if (appointmentArray) {
            // loop appointmentArray to work with each busy appointed time period
            for (let eachAppointment of appointmentArray) {

                var filterProcess = this.filterTimeArray(eachAppointment, timeArray, openTimePoint, closeTimePoint, timeNeededNumberOfTicks, flexibleTime);

            }
        }

        response.data = {
            employee_id: employee.id,
            time_array: timeArray
        };
        response.code = 200;

        return response;


    }


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
    private filterTimeArray(appointment: any, timeArray: any, openTimePoint: number, closeTimePoint: number, timeNeededNumberOfTicks: number, flexibleTime: number) {

        // init leftPoleIndex
        let startPointOfAppointment = appointment.start.min + appointment.start.hour * 60;
        let leftPoleIndex = (startPointOfAppointment - openTimePoint) / SmallestTimeTick;

        // init rightPoleIndex
        let endPointOfAppointment = appointment.end.min + appointment.end.hour * 60;
        let rightPoleIndex = (endPointOfAppointment - openTimePoint) / SmallestTimeTick;


        if (appointment.overlapped) {
            // adjust the poles with touched appointment;
            leftPoleIndex -= timeNeededNumberOfTicks;
        } else {
            // adjust the poles with UNTOUCHED APPOINTMENT;
            leftPoleIndex = leftPoleIndex - timeNeededNumberOfTicks + flexibleTime / SmallestTimeTick;
            rightPoleIndex = rightPoleIndex - flexibleTime / SmallestTimeTick;
        }


        // if leftPoleInded > rightPoleIndex, don't update timeArray;
        // if leftPoleInded<= rightPoleIndex, update timeArray with loop;
        if (leftPoleIndex <= rightPoleIndex) {
            for (let i = rightPoleIndex - 1; (i >= leftPoleIndex) && (i >= 0); i--) {
                timeArray[i].status = false;
            }
        }

        // update overlapped field for element in timeArray due to UNTOUCHED APPOINTMENT 
        if (!appointment.overlapped) {
            for (let i = 1; i <= flexibleTime / SmallestTimeTick; i++) {

                // update right-side elements
                // number of elements need to be updated equal to flexibleTime/SmallestTimeTick 
                timeArray[i + rightPoleIndex - 1].overlapped.status = true;
                timeArray[i + rightPoleIndex - 1].overlapped.appointment_id = appointment.id;

                // update left-side element
                // number of elements need to be updated equal to flexibleTime/SmallestTimeTick
                timeArray[leftPoleIndex - i].overlapped.status = true;
                timeArray[leftPoleIndex - i].overlapped.appointment_id = appointment.id;
            }
        }

        //check if lastAvailPeriod should be mark unavailable.
        let lastAvailPeriodTicks = closeTimePoint / SmallestTimeTick - rightPoleIndex;
        if (lastAvailPeriodTicks < timeNeededNumberOfTicks - flexibleTime / SmallestTimeTick) {
            for (let i = rightPoleIndex; i <= closeTimePoint / SmallestTimeTick; i++) {
                timeArray[i].status = false;
            }
        }

    }
    protected abstract validation(appointment: AppointmentData): SalonCloudResponse<string>;
    protected abstract normalizationData(appointment: AppointmentData): AppointmentData;


}