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
import { SMALLEST_TIME_TICK, FLEXIBLE_TIME } from './../../Core/DefaultData'
import { ServiceManagement } from './../ServiceManagement/ServiceManagement'
import { EmployeeSchedule } from './../Schedule/EmployeeSchedule'
import { ErrorMessage } from './../../Core/ErrorMessage'
import { DailyScheduleData, DailyScheduleArrayData, DailyDayData } from './../Schedule/ScheduleData'
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsValidNameString, IsValidEmployeeId, IsSalonTime, IsValidServiceId, IsAfterSecondDate, IsBeforeSecondDate, IsValidSalonId } from './../../Core/Validation/ValidationDecorators';

export abstract class AppointmentAbstract implements AppointmentBehavior {
    private appointmentManagementDP: AppointmentManagement;

    public salonId: string;
    private SmallestTimeTick: number = SMALLEST_TIME_TICK;
    private FlexbilbleTime: number = FLEXIBLE_TIME;

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
     * step 1: Validate input appointment Data
     * 
     * step 2: Checking booking available time 
     * 
     * step 3: normalize the appointment before saving it
     * 
     * step 4: process to create appointment on database
     * 
     * @memberOf AppointmentAbstract
     */
    public async createAppointment(appointment: AppointmentData): Promise<SalonCloudResponse<AppointmentData>> {
        var response: SalonCloudResponse<AppointmentData> = {
            data: null,
            code: null,
            err: null
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
        var timeAvalibilityCheck = await this.checkBookingAvailableTime(appointment.appointment_items, true);

        if (timeAvalibilityCheck.err) {
            response.err = timeAvalibilityCheck.err;
            response.code = timeAvalibilityCheck.code;
            return response;
        } else {
            appointmentItemsArray = timeAvalibilityCheck.data.response_for_creator;
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
     * @param {Array<AppointmentItemData>} servicesArray
     * @returns
     * 
     * @memberOf AppointmentAbstract
     * 
     * Include a big for-loop running through the appointment-service array, each loop has the following step:
     *      - Get Service data
     *      - Get Employee Schedule and Appointment for that day
     *      - Get Time Array with available and unavailable time point for making appointment   
     *      - Push data to appointment array for return
     * 
     * ReturnDataStructure: {
     *  [{
     *      employee_id: string,
            start: SalonTime,
            end: SalonTime,
            service: {
                    service_id: string,
                    time: number,
                    price: number,
                    service_name: string
                    },
            overlapped: overlappedObject
     * }]
     * }
     */
    /*public async checkBookingAvailableTime(servicesArray: AppointmentItemData[]): Promise<SalonCloudResponse<AppointmentItemData[]>> {
        var response: SalonCloudResponse<Array<AppointmentItemData>> = {
            data: [],
            code: null,
            err: null
        }

        var employeeIdList: Array<string> = [];
        var employeeScheduleList: Array<DailyDayData> = [];
        var employeeAppointmentArrayList: Array<Array<AppointmentItemData>> = [];

        for (var eachService of servicesArray) {
            //get Service Data 
            var getServiceData = await this.getServiceData(eachService);
            if (getServiceData.err) {
                response.err = getServiceData.err;
                response.code = getServiceData.code;
                return response;
            }

            var employeeSchedule = null;
            var employeeAppointmentArray;
            var employeeIndex;

            // get employee schedule and appointment of the employee on that day
            if (employeeIdList.indexOf(eachService.employee_id) !== -1) {
                //this case the employee is already in the array, just retrieve data from it
                employeeIndex = employeeIdList.indexOf(eachService.employee_id);
                employeeSchedule = employeeScheduleList[employeeIndex];
                employeeAppointmentArray = employeeAppointmentArrayList[employeeIndex];
            } else {
                //this case the employee is not in the arrays yet

                //get employee schedule
                var employeeDaySchedule = await this.getEmployeeScheduleForAddedEmployee(eachService, employeeSchedule);
                if (employeeDaySchedule.err) {
                    response.err = employeeDaySchedule.err;
                    response.code = employeeDaySchedule.code;
                    return response;
                } else {
                    employeeSchedule = employeeDaySchedule.data;
                }

                employeeSchedule = {
                    employee_id: eachService.employee_id,
                    close: employeeDaySchedule.data.days[0].close,
                    status: employeeDaySchedule.data.days[0].status,
                    open: employeeDaySchedule.data.days[0].open

                }
                //get appointment for the employee on that day
                var appointmentSearch = await this.getAppointmentForAddedEmployee(eachService, employeeAppointmentArray);
                if (appointmentSearch.err) {
                    response.err = appointmentSearch.err;
                    response.code = appointmentSearch.code;
                    return response;
                } else {
                    employeeAppointmentArray = appointmentSearch.data;
                }

                //push the employee data into the arrays
                employeeIdList.push(eachService.employee_id);
                employeeScheduleList.push(employeeSchedule);
                employeeAppointmentArrayList.push(employeeAppointmentArray);
                employeeIndex = employeeIdList.indexOf(eachService.employee_id);
            }

            //get time array with avail and unvail points
            var getTimeArray = await this.getEmployeeAvailableTime(getServiceData.data.time, eachService.start, employeeDaySchedule.data, employeeAppointmentArray, eachService.service.service_id);
            if (getTimeArray.err) {
                response.err = getTimeArray.err;
                response.code = getTimeArray.code;
                return response;
            } else {
                if (!getTimeArray.data) {
                    response.err = ErrorMessage.AppointmentTimeNotAvailable.err;
                    response.err.data = eachService;
                    response.code = 500;
                    return response;
                } else {

                    //push data to appointment time array 
                    var appointmentArrayResult = await this.makeAppointmentArrayForChecking(eachService, getTimeArray.data, getServiceData, employeeAppointmentArrayList, employeeIndex);
                    if (appointmentArrayResult.err) {
                        response.err = appointmentArrayResult.err;
                        response.code = appointmentArrayResult.code;
                        return response;
                    } else {
                        response.data.push(appointmentArrayResult.data[0]);
                        response.code = appointmentArrayResult.code;
                    }
                }
            }
        }
        return response;
    }
    */
    public async checkBookingAvailableTime(servicesArray: AppointmentItemData[], createAppointmentFlag: boolean): Promise<SalonCloudResponse<CheckBookingAvailableTimeResponseData>> {
        var response: SalonCloudResponse<CheckBookingAvailableTimeResponseData> = {
            data: {
                response_for_creator: [],
                response_for_getter: []
            },
            code: null,
            err: null
        }
        var employeeIdList: Array<string> = [];
        var employeeScheduleList: Array<DailyDayData> = [];
        var employeeAppointmentArrayList: Array<Array<AppointmentItemData>> = [];

        for (var eachService of servicesArray) {
            //get Service Data 
            var getServiceData = await this.getServiceData(eachService);
            if (getServiceData.err) {
                response.err = getServiceData.err;
                response.code = getServiceData.code;
                return response;
            }

            var employeeSchedule = null;
            var employeeAppointmentArray;
            var employeeIndex;

            // get employee schedule and appointment of the employee on that day
            if (employeeIdList.indexOf(eachService.employee_id) !== -1) {
                //this case the employee is already in the array, just retrieve data from it
                employeeIndex = employeeIdList.indexOf(eachService.employee_id);
                employeeSchedule = employeeScheduleList[employeeIndex];
                employeeAppointmentArray = employeeAppointmentArrayList[employeeIndex];
            } else {
                //this case the employee is not in the arrays yet

                //get employee schedule
                var employeeDaySchedule = await this.getEmployeeScheduleForAddedEmployee(eachService, employeeSchedule);
                if (employeeDaySchedule.err) {
                    response.err = employeeDaySchedule.err;
                    response.code = employeeDaySchedule.code;
                    return response;
                } else {
                    employeeSchedule = employeeDaySchedule.data;
                }

                employeeSchedule = {
                    employee_id: eachService.employee_id,
                    close: employeeDaySchedule.data.days[0].close,
                    status: employeeDaySchedule.data.days[0].status,
                    open: employeeDaySchedule.data.days[0].open

                }
                //get appointment for the employee on that day
                var appointmentSearch = await this.getAppointmentForAddedEmployee(eachService, employeeAppointmentArray);
                if (appointmentSearch.err) {
                    response.err = appointmentSearch.err;
                    response.code = appointmentSearch.code;
                    return response;
                } else {
                    employeeAppointmentArray = appointmentSearch.data;
                }

                //push the employee data into the arrays
                employeeIdList.push(eachService.employee_id);
                employeeScheduleList.push(employeeSchedule);
                employeeAppointmentArrayList.push(employeeAppointmentArray);
                employeeIndex = employeeIdList.indexOf(eachService.employee_id);
            }

            //get time array with avail and unvail points
            var getTimeArray = await this.getEmployeeAvailableTime(getServiceData.data.time, eachService.start, employeeDaySchedule.data, employeeAppointmentArray, eachService.service.service_id);
            if (getTimeArray.err) {
                response.err = getTimeArray.err;
                response.code = getTimeArray.code;
                return response;
            } else {
                if (createAppointmentFlag) {
                    if (!getTimeArray.data) {
                        response.err = ErrorMessage.AppointmentTimeNotAvailable.err;
                        response.err.data = eachService;
                        response.code = 500;
                        return response;
                    } else {

                        //push data to appointment time array 
                        var appointmentArrayResult = await this.makeAppointmentArrayForChecking(eachService, getTimeArray.data, getServiceData, employeeAppointmentArrayList, employeeIndex);
                        if (appointmentArrayResult.err) {
                            response.err = appointmentArrayResult.err;
                            response.code = appointmentArrayResult.code;
                            return response;
                        } else {
                            response.data.response_for_creator.push(appointmentArrayResult.data[0]);
                            response.code = appointmentArrayResult.code;
                        }
                    }
                } else {
                    response.code = 200;
                    response.data.response_for_getter.push(getTimeArray.data);
                }
            }
        }
        return response;
    }

    /**
     * The purpose of this function is to modify the parameter 'eachService'
     * 
     * @private
     * @param {AppointmentItemData} eachService
     * @returns void
     * 
     * @memberOf AppointmentAbstract
     */
    private async getServiceData(eachService: AppointmentItemData) {
        var response: SalonCloudResponse<any> = {
            data: null,
            code: null,
            err: null
        }

        var serviceManagementDP = new ServiceManagement(this.salonId);
        var serviceItem = await serviceManagementDP.getServiceItemById(eachService.service.service_id);
        if (serviceItem.err) {
            response.err = serviceItem.err;
            response.code = serviceItem.code;
            return response;
        } else {
            response.data = serviceItem.data;
        }
        // get Time needed and end time
        var timeNeeded = serviceItem.data.time;
        var endTime = new SalonTime();
        endTime.setString(eachService.start.toString());
        endTime.addMinute(timeNeeded / 60);
        eachService.end = endTime;

        return response;

    }



    /**
     * 
     * 
     * @private
     * @param {AppointmentItemData} eachService
     * @param {*} employeeSchedule
     * @returns {Promise<SalonCloudResponse<DailyScheduleArrayData>>}
     * 
     * @memberOf AppointmentAbstract
     */
    private async getEmployeeScheduleForAddedEmployee(eachService: AppointmentItemData, employeeSchedule: any): Promise<SalonCloudResponse<DailyScheduleArrayData>> {

        var response: SalonCloudResponse<DailyScheduleArrayData> = {
            data: null,
            code: null,
            err: null
        }

        var scheduleManagementDP = new EmployeeSchedule(this.salonId, eachService.employee_id)
        var dayInput = eachService.start;
        var employeeDaySchedule = await scheduleManagementDP.getDailySchedule(dayInput, dayInput);
        if (employeeDaySchedule.err) {
            response.err = employeeDaySchedule.err;
            response.code = employeeDaySchedule.code;
            response.data = null;
            return response;
        }

        response.data = employeeDaySchedule.data;
        response.code = employeeDaySchedule.code;
        return response;


    }


    /**
     * 
     * 
     * @private
     * @param {AppointmentItemData} eachService
     * @param {AppointmentItemData[]} employeeAppointmentArray
     * @returns
     * 
     * @memberOf AppointmentAbstract
     */
    private async getAppointmentForAddedEmployee(eachService: AppointmentItemData, employeeAppointmentArray: AppointmentItemData[]) {
        var response: SalonCloudResponse<Array<AppointmentItemData>> = {
            data: null,
            code: null,
            err: null
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
        response.data = employeeAppointmentArray;
        response.code = 200;
        return response;

    }


    /**
     * 
     * 
     * @private
     * @param {AppointmentItemData} eachService
     * @param {*} getTimeArray
     * @param {*} getServiceData
     * @param {Array<Array<AppointmentItemData>>} employeeAppointmentArrayList
     * @param {number} employeeIndex
     * @returns
     * 
     * @memberOf AppointmentAbstract
     */
    private async makeAppointmentArrayForChecking(eachService: AppointmentItemData, getTimeArray: any, getServiceData: any, employeeAppointmentArrayList: Array<Array<AppointmentItemData>>, employeeIndex: number) {
        var response: SalonCloudResponse<Array<AppointmentItemData>> = {
            data: null,
            code: null,
            err: null
        }
        response.data = [];
        let startTimePoint = eachService.start.hour * 60 + eachService.start.min;
        let endTimePoint = eachService.end.hour * 60 + eachService.end.min;
        let amountOfTicks = (endTimePoint - startTimePoint) / this.SmallestTimeTick;
        let amountOfFlexibleTimeTicks = this.FlexbilbleTime / this.SmallestTimeTick;
        for (var eachPoint in getTimeArray.time_array) {
            if (getTimeArray.time_array[eachPoint].time == startTimePoint) {
                if (getTimeArray.time_array[eachPoint].available == true) {
                    //check the total amount of overlapped time;
                    var overlappedCount = 0;
                    var eachPointIndex = Number(eachPoint);
                    for (var i = 0; (i < amountOfTicks) && (eachPointIndex + i < getTimeArray.time_array.length); i++) {
                        if (getTimeArray.time_array[eachPointIndex + i].occupied == true) {
                            overlappedCount++;
                        }
                    }
                    if (overlappedCount > amountOfFlexibleTimeTicks) {
                        response.err = ErrorMessage.BookingTimeNotAvailable.err;
                        response.err.data = eachService;
                        response.code = 400;
                        return response;
                    }
                    //if pass the overlapped time check, start to push data to response data;
                    let appointmentItem: AppointmentItemData = {
                        employee_id: eachService.employee_id,
                        start: eachService.start,
                        end: eachService.end,
                        service: {
                            service_id: getServiceData.data._id,
                            time: getServiceData.data.time,
                            price: getServiceData.data.price,
                            service_name: getServiceData.data.name
                        },
                        overlapped: getTimeArray.time_array[eachPoint].overlapped
                    }
                    //push appointmentItem to the saving appointmentItem array;
                    employeeAppointmentArrayList[employeeIndex].push(appointmentItem);
                    response.data.push(appointmentItem);
                    response.code = 200;
                } else {
                    response.err = ErrorMessage.BookingTimeNotAvailable.err;
                    response.err.data = eachService;
                    response.code = 400;
                    return response;
                }
                break;
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
    public async getEmployeeAvailableTime(timeNeeded: number, startDate: SalonTimeData, employee: DailyScheduleArrayData, appointmentList: Array<AppointmentItemData>, serviceId: string): Promise<SalonCloudResponse<EmployeeTimeArrayObject>> {
        var response: SalonCloudResponse<EmployeeTimeArrayObject> = {
            data: null,
            code: null,
            err: null
        }

        var operatingTime = (employee.days[0].close - employee.days[0].open) / 60;
        if (operatingTime <= 0 || employee.days[0].status == false) {
            response.data = null;
            response.code = 200;
            return response;
        }
        var timeArrayLength = operatingTime / this.SmallestTimeTick + 1;

        var timeNeededNumberOfTicks = timeNeeded / (this.SmallestTimeTick * 60);
        var startTime = new SalonTime(startDate);
        var flexibleTime = this.FlexbilbleTime; //minutes
        // Todo: 
        var endTime = new SalonTime(startDate);
        endTime.addMinute(timeNeeded / 60);

        var openTime = new SalonTime(startDate);
        openTime.setHour(employee.days[0].open / 3600);
        openTime.setMinute(employee.days[0].open % 3600 / 60);
        var openTimeData = openTime;
        var openTimePoint = openTimeData.min + openTimeData.hour * 60;

        var closeTime = new SalonTime(startDate);
        closeTime.setHour(employee.days[0].close / 3600);
        closeTime.setMinute(employee.days[0].close % 3600 / 60);
        var closeTimeData = closeTime;
        var closeTimePoint = closeTimeData.min + closeTimeData.hour * 60;
        //update the last available time in the day for booking with flexible time;
        var lastAvailableTimePoint = employee.days[0].close + flexibleTime * 60;
        var lastAvaliableTime = new SalonTime(startDate);
        lastAvaliableTime.setHour(lastAvailableTimePoint / 3600);
        lastAvaliableTime.setMinute(lastAvailableTimePoint % 3600 / 60);

        //validations
        var startDateString = startTime.toString();
        var endDateString = endTime.toString();
        var openDateString = openTime.toString();
        var closeDateString = closeTime.toString();
        var lastAvalaibleTimeString = lastAvaliableTime.toString();
        //validate start time
        var startTimeValidation = new BaseValidator(startDateString);
        startTimeValidation = new MissingCheck(startTimeValidation, ErrorMessage.MissingStartDate.err);
        startTimeValidation = new IsAfterSecondDate(startTimeValidation, ErrorMessage.BookingTimeNotAvailable.err, openDateString);
        var startTimeError = await startTimeValidation.validate();
        if (startTimeError) {
            response.err = startTimeError;
            response.code = 400;
            return response;
        }
        //validate end time
        var endTimeValidation = new BaseValidator(endDateString);
        endTimeValidation = new MissingCheck(endTimeValidation, ErrorMessage.MissingStartDate.err);
        endTimeValidation = new IsBeforeSecondDate(endTimeValidation, ErrorMessage.BookingTimeNotAvailable.err, lastAvalaibleTimeString);
        var endTimeError = await endTimeValidation.validate();
        if (endTimeError) {
            response.err = endTimeError;
            response.code = 400;
            return response;
        }

        //use the already exist appointmentArray or get one from database;
        var appointmentArray;
        if (appointmentList && appointmentList.length > 0) {
            //use the already exist appointmentArray passed in as appointmentList
            appointmentArray = appointmentList;
        } else {
            // get all employee's appointments in the day;
            var appointmentSearch = await this.appointmentManagementDP.getEmployeeAppointmentByDate(employee.employee_id, startDate);
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
        var timeArray: Array<TimeArrayItem> = [];
        for (let i = 0; i < timeArrayLength; i++) {
            let obj = {
                available: true,
                overlapped: {
                    status: false,
                    appointment_id: null,
                },
                time: openTimePoint + this.SmallestTimeTick * i,
                occupied: false,
            }
            timeArray.push(obj);
        }
        // mark unavailable time point on the timeArray
        if (appointmentArray) {
            // loop appointmentArray to work with each busy appointed time period
            for (let eachAppointment of appointmentArray) {
                //reject the new appointment that is total wrapped or totally wraps another appointment;
                if ((eachAppointment.start.timestamp < startTime.timestamp && eachAppointment.end.timestamp > endTime.timestamp) ||
                    (eachAppointment.start.timestamp > startTime.timestamp && eachAppointment.end.timestamp < endTime.timestamp)) {
                    for (var eachElement of timeArray) {
                        eachElement.available = false;
                    }
                    break;
                }
                //filter Time Array to mark avail/unavail time point for appointment;
                var filterProcess = this.filterTimeArray(eachAppointment, timeArray, openTimePoint, closeTimePoint, timeNeededNumberOfTicks, flexibleTime);

            }
        }
        response.data = {
            employee_id: employee.employee_id,
            time_array: timeArray,
            service_id: serviceId
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
     *                       |---|---xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx---|---|---|---|
     * 
     * Notice: 1 and 11 is still available.
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
     *                     |---|---|---|---|---|---|---xxxxx---|---|---|---|---|---|
     * 
     * Notice: 6 and 9 is still available.
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
    private filterTimeArray(appointment: any, timeArray: Array<TimeArrayItem>, openTimePoint: number, closeTimePoint: number, timeNeededNumberOfTicks: number, flexibleTime: number) {
        // init leftPoleIndex
        let startPointOfAppointment = appointment.start.min + appointment.start.hour * 60;
        let leftPoleIndex = (startPointOfAppointment - openTimePoint) / this.SmallestTimeTick;
        // init rightPoleIndex
        let endPointOfAppointment = appointment.end.min + appointment.end.hour * 60;
        let rightPoleIndex = (endPointOfAppointment - openTimePoint) / this.SmallestTimeTick;
        //update occupied fields
        for (let i = leftPoleIndex; i < rightPoleIndex; i++) {
            timeArray[i].occupied = true;
        }

        if (appointment.overlapped.status === true) {
            // adjust the poles with touched appointment;
            leftPoleIndex -= timeNeededNumberOfTicks;
        } else {

            // adjust the poles with UNTOUCHED APPOINTMENT;
            leftPoleIndex = leftPoleIndex - timeNeededNumberOfTicks + flexibleTime / this.SmallestTimeTick;
            rightPoleIndex = rightPoleIndex - flexibleTime / this.SmallestTimeTick;
        }

        // if leftPoleInded > rightPoleIndex, don't update timeArray;
        // if leftPoleInded<= rightPoleIndex, update timeArray with loop;
        if (leftPoleIndex <= rightPoleIndex) {
            for (let i = rightPoleIndex - 1; i > leftPoleIndex; i--) {
                if (i >= 0 && i <= timeArray.length - 1) {
                    timeArray[i].available = false;
                }
            }
        }
        // update overlapped field for element in timeArray due to UNTOUCHED APPOINTMENT 
        if (appointment.overlapped.status === false) {
            for (let i = 0; i < flexibleTime / this.SmallestTimeTick; i++) {

                // update right-side elements
                // number of elements need to be updated equal to flexibleTime/SmallestTimeTick
                var rightPoleArrayIndex = (rightPoleIndex + i) <= (timeArray.length - 1) ? (rightPoleIndex + i) : (timeArray.length - 1);
                timeArray[rightPoleArrayIndex].overlapped.status = true;
                timeArray[rightPoleArrayIndex].overlapped.appointment_id = appointment.appointment_id;

                // update left-side element
                // number of elements need to be updated equal to flexibleTime/SmallestTimeTick
                var leftPoleArrayIndex = (leftPoleIndex - i) >= 0 ? (leftPoleIndex - i) : 0;
                timeArray[leftPoleArrayIndex].overlapped.status = true;
                timeArray[leftPoleArrayIndex].overlapped.appointment_id = appointment.appointment_id;
            }
        }
        //check if lastAvailPeriod should be mark unavailable.
        let lastAvailPeriodTicks = closeTimePoint / this.SmallestTimeTick - rightPoleIndex;
        if (lastAvailPeriodTicks < timeNeededNumberOfTicks - flexibleTime / this.SmallestTimeTick) {
            for (let i = rightPoleIndex; i <= closeTimePoint / this.SmallestTimeTick; i++) {
                timeArray[i].available = false;
            }
        }
        return;

    }

    public async validateServices(serviceArray: AppointmentItemData[]): Promise<SalonCloudResponse<any>> {
        var response: SalonCloudResponse<Array<AppointmentItemData>> = {
            data: null,
            code: null,
            err: null
        }
        var salonIdValidator = new BaseValidator(this.salonId);
        salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId.err);
        salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.SalonNotFound.err);
        var salonIdResult = await salonIdValidator.validate();
        if (salonIdResult) {
            response.err = salonIdResult;
            response.code = 400;
            return response;
        }

        let servicesValidation = new BaseValidator(serviceArray);
        servicesValidation = new MissingCheck(servicesValidation, ErrorMessage.MissingBookedServiceList.err);
        let servicesError = await servicesValidation.validate();
        if (servicesError) {
            response.code = 400;
            response.err = servicesError;
            return response;
        }

        for (var eachItem of serviceArray) {
            let employeeIdValidator = new BaseValidator(eachItem.employee_id);
            employeeIdValidator = new MissingCheck(employeeIdValidator, ErrorMessage.MissingEmployeeId.err);
            employeeIdValidator = new IsValidEmployeeId(employeeIdValidator, ErrorMessage.EmployeeNotFound.err, this.salonId);
            let employeeIdError = await employeeIdValidator.validate();
            if (employeeIdError) {
                response.err = employeeIdError;
                response.code = 400;
                return response;
            }

            let startValidator = new BaseValidator(eachItem.start);
            startValidator = new MissingCheck(startValidator, ErrorMessage.MissingStartDate.err);
            startValidator = new IsSalonTime(startValidator, ErrorMessage.WrongBookingTimeFormat.err)
            let startError = await startValidator.validate();
            if (startError) {
                response.err = startError;
                response.code = 400;
                return response;
            }

            let serviceValidator = new BaseValidator(eachItem.service);
            serviceValidator = new MissingCheck(serviceValidator, ErrorMessage.MissingServiceItem.err);
            let serviceError = await serviceValidator.validate();
            if (serviceError) {
                response.err = serviceError;
                response.code = 400;
                return response;
            }

            let serviceIdValidator = new BaseValidator(eachItem.service.service_id);
            serviceIdValidator = new MissingCheck(serviceIdValidator, ErrorMessage.MissingServiceId.err);
            serviceIdValidator = new IsValidServiceId(serviceIdValidator, ErrorMessage.ServiceNotFound.err, this.salonId);
            let serviceIdError = await serviceIdValidator.validate();
            if (serviceIdError) {
                response.err = serviceIdError;
                response.code = 400;
                return response;
            }

            let overLapValidator = new BaseValidator(eachItem.overlapped);
            overLapValidator = new MissingCheck(overLapValidator, ErrorMessage.MissingOverlappedObject.err);
            let overLapError = await overLapValidator.validate();
            if (overLapError) {
                response.err = overLapError;
                response.code = 400;
                return response;
            }

            let overlapStatusValidator = new BaseValidator(eachItem.overlapped.status);
            overlapStatusValidator = new MissingCheck(overlapStatusValidator, ErrorMessage.MissingOverlappedStatus.err);
            let overlapStatusError = await overlapStatusValidator.validate();
            if (overlapStatusError) {
                response.err = overlapStatusError;
                response.code = 400;
                return response;
            }

            if (eachItem.overlapped.status) {
                let overlapAppointmentIdValidator = new BaseValidator(eachItem.overlapped.overlapped_appointment_id);
                overlapAppointmentIdValidator = new MissingCheck(overlapAppointmentIdValidator, ErrorMessage.MissingAppointmentId.err);

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

export interface TimeArrayItem {

    available: boolean,
    overlapped: {
        status: boolean,
        appointment_id?: string,
    },
    time: number,
    occupied?: boolean,


}

export interface EmployeeTimeArrayObject {
    service_id: string,
    employee_id: string,
    time_array: TimeArrayItem[]

}

export interface CheckBookingAvailableTimeResponseData {
    response_for_getter: EmployeeTimeArrayObject[],
    response_for_creator: AppointmentItemData[]
}