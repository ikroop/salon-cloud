/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
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
import { ErrorMessage } from './../../Core/ErrorMessage'
import { DailyScheduleData, DailyScheduleArrayData } from './../Schedule/ScheduleData'
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsValidNameString, IsValidEmployeeId, IsSalonTime, IsValidServiceId } from './../../Core/Validation/ValidationDecorators';

export abstract class AppointmentAbstract implements AppointmentBehavior {
    private appointmentManagementDP: AppointmentManagement;

    public salonId: string;

    /**
     * Creates an instance of AppointmentAbstract.
     * 
     * @param {string} salonId
     * @param {AppointmentManagement} appointmentManagementDP
     * 
     * @memberOf AppointmentAbstract
     */
    constructor(salonId: string, appointmentManagementDP: AppointmentManagement) {
        this.salonId = salonId;
        this.appointmentManagementDP = appointmentManagementDP;
    }

    public cancelAppointment(appointmentId: string) {
        return;
    };

    /**
     * 
     * 
     * @param {AppointmentData} appointment
     * @returns {Promise<SalonCloudResponse<AppointmentData>>}
     * 
     * @memberOf AppointmentAbstract
     */
    public async createAppointment(appointment: AppointmentData): Promise<SalonCloudResponse<AppointmentData>> {
        var response: SalonCloudResponse<AppointmentData> = {
            data: undefined,
            code: undefined,
            err: undefined
        }

        //validate appointment data
        var validationResult = await this.validation(appointment);
        if (validationResult.code != 200) {
            response.code = validationResult.code;
            response = validationResult;
            return response;
        }

         // get available time
        var appointmentItemsArray: Array<AppointmentItemData>;
        // create Service
        var timeAvalibilityCheck = await this.checkBookingAvailableTime(appointment.appointment_items);

        if (timeAvalibilityCheck.err) {
            response.err = timeAvalibilityCheck.err;
            response.code = timeAvalibilityCheck.code;
            return response;
        } else {
            appointmentItemsArray = timeAvalibilityCheck.data;
        }

        // Salon has available time for appointment, process to save appointment
        appointment.appointment_items = appointmentItemsArray;

        //Normalization Data
        var newAppointment = this.normalizationData(appointment);

        // Create appointment document
        //var result = this.createAppointmentDoc(appointment);
        var result: SalonCloudResponse<AppointmentData> = await this.appointmentManagementDP.createAppointment(newAppointment);
        if (result.err) {
            response.err = result.err;
            response.code = result.code;
            return response;
        }

        response.data = result.data;
        response.code = 200;
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
     * 
     * @param {Array<any>} servicesArray
     * @returns
     * 
     * @memberOf AppointmentAbstract
     */
    public async checkBookingAvailableTime(servicesArray: AppointmentItemData[]): Promise<SalonCloudResponse<AppointmentItemData[]>> {
        var response: SalonCloudResponse<Array<AppointmentItemData>> = {
            data: undefined,
            code: undefined,
            err: undefined
        }


        var employeeIdList: Array<string> = [];
        var employeeScheduleList: Array<any> = [];
        var employeeAppointmentArrayList: Array<Array<AppointmentItemData>> = [];
        for (var eachService of servicesArray) {
            // get service data
            var serviceManagementDP = new ServiceManagement(this.salonId);
            var serviceItem = await serviceManagementDP.getServiceItemById(eachService.service.service_id);
            if (serviceItem.err) {
                response.err = serviceItem.err;
                response.code = serviceItem.code;
                return response;
            }
            // get Time needed and end time
            var timeNeeded = serviceItem.data.time;
            var endTime = new SalonTime();
            endTime.setString(eachService.start.toString());
            endTime.addMinute(timeNeeded / 60);
            eachService.end = endTime;

            // get emloyee schedule
            var employeeSchedule;
            var employeeAppointmentArray;
            var employeeIndex;
            if (employeeIdList.indexOf(eachService.employee_id) !== -1) {
                employeeIndex = employeeIdList.indexOf(eachService.employee_id);
                employeeSchedule = employeeScheduleList[employeeIndex];
                employeeAppointmentArray = employeeAppointmentArrayList[employeeIndex];
            } else {
                var scheduleManagementDP = new EmployeeSchedule(this.salonId, eachService.employee_id)
                var dayInput = eachService.start;
                var employeeDaySchedule = await scheduleManagementDP.getDailySchedule(dayInput, dayInput);
                if (employeeDaySchedule.err) {
                    response.err = employeeDaySchedule.err;
                    response.code = employeeDaySchedule.code;
                    response.data = undefined;
                    return response;
                }
                employeeSchedule = {
                    employee_id: eachService.employee_id,
                    close: employeeDaySchedule.data.days[0].close,
                    status: employeeDaySchedule.data.days[0].status,
                    open: employeeDaySchedule.data.days[0].open

                }
                var appointmentSearch = await this.appointmentManagementDP.getEmployeeAppointmentByDate(eachService.employee_id, eachService.start);
                if (appointmentSearch) {
                    if (appointmentSearch.err) {
                        response.err = appointmentSearch.err;
                        response.code = appointmentSearch.code;
                        return response;
                    } else {
                        if (appointmentSearch.data) {
                            employeeAppointmentArray = appointmentSearch.data;
                        } else {
                            employeeAppointmentArray = [];
                        }
                    }
                } else {
                    employeeAppointmentArray = [];
                }

                employeeIdList.push(eachService.employee_id);
                employeeScheduleList.push(employeeSchedule);
                employeeAppointmentArrayList.push(employeeAppointmentArray);
                employeeIndex = employeeIdList.indexOf(eachService.employee_id);


            }
            var getTimeArray = await this.getEmployeeAvailableTime(timeNeeded, eachService.start, employeeDaySchedule.data, employeeAppointmentArray);
            if (getTimeArray.err) {
                response.err = getTimeArray.err;
                response.code = getTimeArray.code;
            } else {
                if (!getTimeArray.data) {
                    response.err = ErrorMessage.AppointmentTimeNotAvailable;
                    response.err.data = eachService;
                    response.code = 500;
                    return response;
                } else {
                    response.data = [];
                    let startTimePoint = eachService.start.hour * 60 + eachService.start.min;
                    for (var eachPoint of getTimeArray.data.time_array) {
                        if (eachPoint.time == startTimePoint) {
                            if (eachPoint.available == true) {
                                let appointmentItem: AppointmentItemData = {
                                    employee_id: eachService.employee_id,
                                    start: eachService.start,
                                    end: eachService.end,
                                    service: {
                                        service_id: serviceItem.data._id,
                                        time: serviceItem.data.time,
                                        price: serviceItem.data.price,
                                        service_name: serviceItem.data.name
                                    },
                                    overlapped: eachPoint.overlapped
                                }
                                employeeAppointmentArrayList[employeeIndex].push(appointmentItem);
                                response.data.push(appointmentItem);
                                response.code = 200;
                            } else {
                                response.err = ErrorMessage.AppointmentTimeNotAvailable;
                                response.err.data = eachService;
                                response.code = 500;
                                return response;
                            }
                            break;
                        }
                    }
                }
            }
        }
        return response;
    }
    private createAppointmentDoc(appointment: AppointmentData) {

    }

    /**
    * @name: getEmployeeAvailableTime
    * @param:  timeNeeded: number, date: SalonTimeData, employee: any // expecting 'employee': {status: boolean, close: number, open: number, employee_id: string}  
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
    public async getEmployeeAvailableTime(timeNeeded: number, date: SalonTimeData, employee: DailyScheduleArrayData, appointmentList: Array<AppointmentItemData>): Promise<SalonCloudResponse<any>> {
        var response: SalonCloudResponse<any> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        var operatingTime = (employee.days[0].close - employee.days[0].open) / 60;
        if (operatingTime <= 0 || employee.days[0].status == false) {
            response.data = undefined;
            response.code = 200;
            return response;
        }
        var timeArrayLength = operatingTime / SmallestTimeTick + 1;

        var timeNeededNumberOfTicks = timeNeeded / SmallestTimeTick;
        var day = new SalonTime(date);
        var flexibleTime;
        // Todo: 
        var openTime = new SalonTime(date);
        openTime.setHour(employee.days[0].open / 3600);
        openTime.setMinute(employee.days[0].open % 3600 / 60);

        var openTimeData = openTime;
        var openTimePoint = openTimeData.min + openTimeData.hour * 60;

        var closeTime = new SalonTime(date);
        closeTime.setHour(employee.days[0].close / 3600);
        closeTime.setMinute(employee.days[0].close % 3600 / 60);

        var closeTimeData = closeTime;
        var closeTimePoint = closeTimeData.min + closeTimeData.hour * 60;
        var appointmentArray;
        if (appointmentList) {
            appointmentArray = appointmentList;
        } else {
            // get all employee's appointments in the day;
            var appointmentSearch = await this.appointmentManagementDP.getEmployeeAppointmentByDate(employee.employee_id, date);
            if (appointmentSearch.err) {
                response.err = appointmentSearch.err;
                response.code = appointmentSearch.code;
                return response;
            } else {
                if (appointmentSearch.data) {
                    appointmentArray = appointmentSearch.data;
                } else {
                    appointmentArray = [];
                }
            }

        }
        // initilize timArray
        var timeArray: Array<any> = [];
        for (let i = 0; i < timeArrayLength; i++) {
            let obj = {
                available: true,
                overlapped: {
                    status: false,
                    appointment_id: undefined,
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
            employee_id: employee.employee_id,
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
                timeArray[i].available = false;
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
                timeArray[i].available = false;
            }
        }
        return;

    }

    protected async validateServices(serviceArray: AppointmentItemData[]): Promise<SalonCloudResponse<any>> {
        var response: SalonCloudResponse<Array<AppointmentItemData>> = {
            data: undefined,
            code: undefined,
            err: undefined
        }
        let servicesValidation = new BaseValidator(serviceArray);
        servicesValidation = new MissingCheck(servicesValidation, ErrorMessage.MissingBookedServiceList);
        let servicesError = await servicesValidation.validate();
        if (servicesError) {
            response.code = 400;
            response.err = servicesError;
            return response;
        }

         for (var eachItem of serviceArray) {
            let employeeIdValidator = new BaseValidator(eachItem.employee_id);
            employeeIdValidator = new MissingCheck(employeeIdValidator, ErrorMessage.MissingEmployeeId);
            employeeIdValidator = new IsValidEmployeeId(employeeIdValidator,  ErrorMessage.EmployeeNotFound, this.salonId);
            let employeeIdError = await employeeIdValidator.validate();
            if (employeeIdError) {
                response.err = employeeIdError;
                response.code = 400;
                return response;
            }

            let startValidator = new BaseValidator(eachItem.start);
            startValidator = new MissingCheck(startValidator, ErrorMessage.MissingStartDate);
            startValidator = new IsSalonTime(startValidator, ErrorMessage.WrongBookingTimeFormat)
            let startError = await startValidator.validate();
            if (startError) {
                response.err = startError;
                response.code = 400;
                return response;
            }

            let serviceValidator = new BaseValidator(eachItem.service);
            serviceValidator = new MissingCheck(serviceValidator, ErrorMessage.MissingServiceItem);
            let serviceError = await serviceValidator.validate();
            if (serviceError) {
                response.err = serviceError;
                response.code = 400;
                return response;
            }

            let serviceIdValidator = new BaseValidator(eachItem.service.service_id);
            serviceIdValidator = new MissingCheck(serviceIdValidator, ErrorMessage.MissingServiceId);
            serviceIdValidator = new IsValidServiceId(serviceIdValidator, ErrorMessage.ServiceNotFound, this.salonId);
            let serviceIdError = await serviceIdValidator.validate();
            if (serviceIdError) {
                response.err = serviceIdError;
                response.code = 400;
                return response;
            }

            let overLapValidator = new BaseValidator(eachItem.overlapped);
            overLapValidator = new MissingCheck(overLapValidator, ErrorMessage.MissingOverlappedObject);
            let overLapError = await overLapValidator.validate();
            if (overLapError) {
                response.err = overLapError;
                response.code = 400;
                return response;
            }

            let overlapStatusValidator = new BaseValidator(eachItem.overlapped.status);
            overlapStatusValidator = new MissingCheck(overlapStatusValidator, ErrorMessage.MissingOverlappedStatus);
            let overlapStatusError = await overlapStatusValidator.validate();
            if (overlapStatusError) {
                response.err = overlapStatusError;
                response.code = 400;
                return response;
            }

            if (eachItem.overlapped.status) {
                let overlapAppointmentIdValidator = new BaseValidator(eachItem.overlapped.overlapped_appointment_id);
                overlapAppointmentIdValidator = new MissingCheck(overlapAppointmentIdValidator, ErrorMessage.MissingAppointmentId);

                let overlapAppointmentIdError = await overlapAppointmentIdValidator.validate();
                if (overlapAppointmentIdError) {
                    response.err = overlapAppointmentIdError;
                    response.code = 500;
                    return response;
                }
            }

        }

        return response;


    }
    protected abstract validation(appointment: AppointmentData): Promise<SalonCloudResponse<any>>;
    protected abstract normalizationData(appointment: AppointmentData): AppointmentData;


}