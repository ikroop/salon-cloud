/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import * as server from '../src/App';
import * as request from 'supertest';
import * as chai from 'chai';
var expect = chai.expect;
var should = chai.should();
import { ErrorMessage } from './../src/Core/ErrorMessage';
import { ServiceManagement } from './../src/Modules/ServiceManagement/ServiceManagement';
import { EmployeeSchedule } from './../src/Modules/Schedule/EmployeeSchedule';
import { Authentication } from './../src/Core/Authentication/Authentication';
import { SignedInUser } from './../src/Core/User/SignedInUser';
import { Owner } from './../src/Core/User/Owner';
import { SalonManagement } from './../src/Modules/SalonManagement/SalonManagement';
import { PhoneVerification } from './../src/Core/Verification/PhoneVerification';
import { SalonTime } from './../src/Core/SalonTime/SalonTime';
import { EmployeeReturn } from './../src/Modules/UserManagement/EmployeeData';
import { UserToken } from './../src/Core/Authentication/AuthenticationData';
import { SalonCloudResponse } from './../src/Core/SalonCloudResponse';
import { SalonInformation } from './../src/Modules/SalonManagement/SalonData';
import { UserProfile } from './../src/Modules/UserManagement/UserData';
import * as moment from 'moment';



describe('Appointment Management', function () {
    var validToken;
    var invalidToken = 'eyJhbGciOiJSUz';
    var validSalonId;
    var invalidSalonId = "5825e0365193422";
    var notFoundSalonId = "5825e03651934227174513d8";
    var defaultPassword = '1234@1234';
    var rightFormattedPhoneNumber = '9384484728';
    var wrongFormattedPhoneNumber = 'abd1234';
    var rightFormattedName = 'Tom Hanks';
    var emptyName = '   ';
    var tooLongName = 'Alibaba Nam Tren Ghe Sopha Mo Ve Noi Xa Xong Pha Tran Mac Cuop Duoc Dola Thiet Thiet La Nhieu Dola Xay Nha Cho Mafia'
    var validServiceId = '';
    var validServiceIdWithShorterTime = '';
    var validServiceIdWithLongerTime = '';
    var invalidServiceId = '0000';
    var notFoundEmployeeId = '5825e7bb1dac3e2804d015fl';
    var invalidEmployeeId = '1111';
    var validEmployeeId;
    var anotherUserId;
    var anotherUserToken;
    var notFoundServiceId = '5825e03651934227174516d8';
    var employeeScheduleOpenTime, employeeScheduleCloseTime;
    var aTimeCase15, aTimeCase16, aTimeCase17, aTimeCase18, aTimeCase19;//TODO
    var aTimeCase20, aTimeCase21, aTimeCase22, aTimeCase23, aTimeCase24;//TODO
    var aTimeCase25, aTimeCase261, aTimeCase262, aTimeCase27, aTimeCase28, aTimeCase29;//TODO

    const date = new Date(2018, 3, 13);

    beforeEach(function (done) {
        setTimeout(function () {
            done();
        }, 500);
    });


    before(async function () {

        // Login and get token
        var user = {
            username: 'unittest1473044833007@gmail.com',
            password: defaultPassword
        };

        // 1. Create Owner 
        var authentication = new Authentication();
        const ownerEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
        await authentication.signUpWithUsernameAndPassword(ownerEmail, defaultPassword);

        const AnotherWwnerEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
        await authentication.signUpWithUsernameAndPassword(AnotherWwnerEmail, defaultPassword);
        // 2. login to get access token
        var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(ownerEmail, defaultPassword);
        validToken = loginData.data.auth.token;
        // 3. Create salon
        var signedInUser = new SignedInUser(loginData.data.user._id, new SalonManagement(null));
        var salonInformationInput: SalonInformation = {
            email: 'salon@salon.com',
            phone: {
                number: '7703456789',
                is_verified: false
            },
            location: {
                address: '2506 Bailey Dr NW, Norcross, GA 30071',
                is_verified: false,
                timezone_id: null
            },
            salon_name: 'Salon Appointment Test'
        }
        var salon = await signedInUser.createSalon(salonInformationInput);

        validSalonId = salon.data.id;
        // 4. Add new employee
        const owner = new Owner(loginData.data.user._id, new SalonManagement(validSalonId));
        // Add new employee
        const employeeInput: UserProfile = {
            salon_id: validSalonId,
            role: 2,
            phone: "7703456789",
            fullname: "Jimmy Tran",
            nickname: "Jimmy",
            salary_rate: 0.6,
            cash_rate: 0.6,
            social_security_number: null
        };

        const employeeEmail = `${Math.random().toString(36).substring(7)}@gmail.com`;
        const employee: SalonCloudResponse<EmployeeReturn> = await owner.addEmployee(employeeEmail, employeeInput, new PhoneVerification());
        validEmployeeId = employee.data.uid;

        // Create new user
        var authentication = new Authentication();
        const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
        await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
        // Get Token
        var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
        anotherUserId = loginData.data.user._id;
        anotherUserToken = loginData.data.auth.token;
        // Insert services
        const groupServiceInput = {
            "group_name": "sample group name",
            "description": "description of group",
            "salon_id": validSalonId,
            "service_list": [
                {
                    name: "The first service",
                    price: 20,
                    time: 60 * 60
                }
            ]
        };

        // Get services 
        const serviceManagement = new ServiceManagement(validSalonId);
        const service_array = await serviceManagement.getServices();
        var validGroupService = service_array.data[0];
        var validGroupService1 = service_array.data[1];
        validServiceId = validGroupService.service_list[0]._id;
        validServiceIdWithShorterTime = validGroupService.service_list[1]._id; //1200
        validServiceIdWithLongerTime = validGroupService1.service_list[0]._id; //2400

        // Get Daily Schedule
        const employeeSchedule = new EmployeeSchedule(validSalonId, validEmployeeId);

        //employeeDailySchedule = EmployeeSchedule.getDailySchedule()
        var salonTime = new SalonTime();
        // set date to SalonTime Object
        const employeeDailySchedule = await employeeSchedule.getDailySchedule(salonTime, salonTime);

        employeeScheduleOpenTime = employeeDailySchedule.data.days[0].open;
        employeeScheduleCloseTime = employeeDailySchedule.data.days[0].close;

        var aTimeCase15InSecond = employeeScheduleOpenTime - 75 * 60; //1
        var aTimeCase16InSecond = employeeScheduleCloseTime + 75 * 60; //2
        var aTimeCase17InSecond = employeeScheduleCloseTime - 15 * 60; //3 longer service 45' 
        var aTimeCase18InSecond = employeeScheduleOpenTime; //4 30' OK
        var aTimeCase19InSecond = employeeScheduleCloseTime - 30 * 60; //5 30' OK
        var aTimeCase20InSecond = employeeScheduleOpenTime; //6 longer service time 45'
        var aTimeCase21InSecond = employeeScheduleCloseTime - 45 * 60; //7 longer service 45'
        var aTimeCase22InSecond = employeeScheduleOpenTime + 15 * 60; //8 30' OK
        var aTimeCase23InSecond = employeeScheduleCloseTime - 45 * 60; //9 30' OK
        var aTimeCase24InSecond = employeeScheduleOpenTime + 30 * 60; //10 30' Error
        var aTimeCase25InSecond = employeeScheduleCloseTime - 60 * 60; //11 30' Error
        var aTimeCase261InSecond = employeeScheduleOpenTime + 90 * 60; //12 shorter service 15' ok
        var aTimeCase262InSecond = employeeScheduleOpenTime + 120 * 60; //12 longer service time 45' OK 
        var aTimeCase27InSecond = employeeScheduleOpenTime + 135 * 60; //13 shorter Service Time 15' 
        var aTimeCase28InSecond = employeeScheduleOpenTime + 75 * 60; //14 longer Service Time 45'
        var aTimeCase29InSecond = employeeScheduleOpenTime + 90 * 60; //15 longer service time 45'


        function getDateString(dateString: string, time: number): string {
            var date = moment(dateString, 'YYYY-MM-DD HH:mm:ss');
            var hour = time / 3600;
            var minute = time % 3600 / 60;
            date.hour(hour);
            date.minute(minute);
            date.second(0);
            var returnString = date.format('YYYY-MM-DD HH:mm:ss');
            return returnString;

        }

        var dateString = "2017-02-28 10:45:00";

        aTimeCase15 = getDateString(dateString, aTimeCase15InSecond);
        aTimeCase16 = getDateString(dateString, aTimeCase16InSecond);
        aTimeCase17 = getDateString(dateString, aTimeCase17InSecond);
        aTimeCase18 = getDateString(dateString, aTimeCase18InSecond);
        aTimeCase19 = getDateString(dateString, aTimeCase19InSecond);
        aTimeCase20 = getDateString(dateString, aTimeCase20InSecond);
        aTimeCase21 = getDateString(dateString, aTimeCase21InSecond);
        aTimeCase22 = getDateString(dateString, aTimeCase22InSecond);
        aTimeCase23 = getDateString(dateString, aTimeCase23InSecond);
        aTimeCase24 = getDateString(dateString, aTimeCase24InSecond);
        aTimeCase25 = getDateString(dateString, aTimeCase25InSecond);
        aTimeCase261 = getDateString(dateString, aTimeCase261InSecond);
        aTimeCase262 = getDateString(dateString, aTimeCase262InSecond);
        aTimeCase27 = getDateString(dateString, aTimeCase27InSecond);
        aTimeCase28 = getDateString(dateString, aTimeCase28InSecond);
        aTimeCase29 = getDateString(dateString, aTimeCase29InSecond);
        var test = getDateString(dateString, aTimeCase15);

    });

    describe('Unit Test Create Appointment By Phone', function () {
        var apiUrl = '/api/v1/appointment/createbyphone';

        /* 1	Invalid token	403	
                error : 
                    - name: 'InvalidTokenError' 
                    - message: 'Token is invalid'
        */
        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to create appointment with invalid token', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': invalidToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.Unauthorized.err.name);
                    res.body.error.code.should.be.equal(401);
                    done();
                });
        });

        it('should return ' + ErrorMessage.Forbidden.err.name + ' error trying to create appointment with no permission account', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': anotherUserToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.Forbidden.err.name);
                    res.body.error.code.should.be.equal(403);
                    done();
                });
        });

        /* 2	Missing Phone Number	400	
                error : 
                    - name: 'MissingPhoneNumber' 
                    - message: 'Missing Phone Number'
        */
        it('should return ' + ErrorMessage.MissingPhoneNumber.err.name + ' error trying to create appointment without customer\'s phone', function (done) {
            var bodyRequest = {
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingPhoneNumber.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 3	Wrong Phone Number Format	400	
                error : 
                    - name: 'WrongPhoneNumberFormat' 
                    - message: 'Wrong Phone Number Format'
        */
        it('should return ' + ErrorMessage.WrongPhoneNumberFormat.err.name + ' error trying to create appointment with wrong-formatted phone number', function (done) {
            var bodyRequest = {
                "customer_phone": wrongFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongPhoneNumberFormat.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });


        /* 4	Missing Customer Name	400	
                error : 
                    - name: 'MissingCustomerName' 
                    - message: 'Missing Customer Name' 
        */
        it('should return ' + ErrorMessage.MissingCustomerName.err.name + ' error trying to create appointment without customer\'s name', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingCustomerName.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 5	Invalid Name String (name is empty)	400	
                error : 
                    - name: 'InvalidNameString' 
                    - message: 'Invalid Name String (Name is empty)'
        */
        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to create appointment with customer\'s name = empty string', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": emptyName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidNameString.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 7	Missing SalonID	400	
                error : 
                    - name: 'MissingSalonID' 
                    - message: 'Missing SalonID'
        */
        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to create appointment without salonId', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingSalonId.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 8	Salon Not Found	400
                error : 
                    - name: 'SalonNotFound' 
                    - message: 'Salon Not Found'
        */
        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to create appointment with wrong salonId', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": notFoundSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.SalonNotFound.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 9	Missing Booked Service List	400	
                error : 
                    - name: 'MissingBookedServiceList' 
                    - message: 'Missing Booked Service List'
        */
        it('should return ' + ErrorMessage.MissingBookedServiceList.err.name + ' error trying to create appointment without service(s)', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note"
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingBookedServiceList.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 10	Missing Service Id	400	
                error : 
                    - name: 'MissingServiceId' 
                    - message: 'Missing Service Id'
        */
        it('should return ' + ErrorMessage.MissingServiceId.err.name + ' error trying to create appointment which has service with no serviceId', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }, {
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingServiceId.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 11	Service Not Found	400	
                error : 
                    - name: 'ServiceNotFound' 
                    - message: 'Service Not Found'
        */
        it('should return ' + ErrorMessage.ServiceNotFound.err.name + ' error trying to create appointment which has not-found service', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }, {
                    service_id: notFoundServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 11:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.ServiceNotFound.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 12	Missing Employee Id	400	
                error : 
                    - name: 'MissingEmployeeId' 
                    - message: 'Missing Employee Id'
        */
        it('should return ' + ErrorMessage.MissingEmployeeId.err.name + ' error trying to create appointment which has service with no employeeId', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    start: "2017-02-28 10:45:00"
                }, {
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 11:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingEmployeeId.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 13	Employee Not Found	400	
                error : 
                    - name: 'EmployeeNotFound' 
                    - message: 'Employee Not Found'
        */
        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to create appointment which has not-found employee', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: notFoundEmployeeId,
                    start: "2017-02-28 10:45:00"
                }, {
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.EmployeeNotFound.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        /* 14	Missing Appointment Time	400	
                error : 
                    - name: 'MissingAppointmentTime' 
                    - message: 'Missing Appointment Time'
        */
        it('should return ' + ErrorMessage.WrongBookingTimeFormat.err.name + ' error trying to create appointment without booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId
                }],
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongBookingTimeFormat.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongBookingTimeFormat.err.name + ' error trying to create appointment which has no-day booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02 10:45:00"
                }, {
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongBookingTimeFormat.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongBookingTimeFormat.err.name + ' error trying to create appointment which has no-month booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
                }, {
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-28 11:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongBookingTimeFormat.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongBookingTimeFormat.err.name + ' error trying to create appointment which has no-year booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 11:45:00"
                }, {
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "02-28 11:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongBookingTimeFormat.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongBookingTimeFormat.err.name + ' error trying to create appointment which has no-hour booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 45:00"
                }, {
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 11:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongBookingTimeFormat.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongBookingTimeFormat.err.name + ' error trying to create appointment which has no-minute booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 11::00"
                }, {
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 11:45:00"
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongBookingTimeFormat.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Mapping from case 1 to case 15 follow discussion with @Truong Thanh

        // Case 1 - ERROR: AppointmentTime.Start < SalonDailySchedule.Open
        /* 15	AppointmentTime.Start < SalonDailySchedule.Open	400	
                error : 
                    - name: 'EarlierAppointmentTimeThanSalonTimeOnCertainDate' 
                    - message: 'Appointment's start time is earlier than salon's open time on appointment date on that date'
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which has early booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: aTimeCase15
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Case 2 - ERROR: AppointmentTime.Start > SalonDailySchedule.Close
        /* 16	AppointmentTime.Start > SalonDailySchedule.Close	400	
                error : 
                    - name: 'LaterAppointmentTimeThanSalonTimeOnCertainDate' 
                    - message: 'Appointment's start time is later than salon's open time on appointment date on that date'
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which has late booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: aTimeCase16
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Case 3 - ERROR: (SalonDailySchedule.Close - AppointmentTime.End) > Flexibale time
        /* 17	AppointmentTime.End > SalonDailySchedule.Close	400	
                error : 
                    - name: 'AppointmentCanNotBeDoneWithinSalonWorkingTime' 
                    - message: 'Appointment cannot be done within salon's working time'
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which cannot be done within salon\'s working time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceIdWithLongerTime,
                    employee_id: validEmployeeId,
                    start: aTimeCase17
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Case 4 - OK: (CurrentAppointmentTime.Start = SalonDailySchedule.Start)
        /* 18
        */
        it('should return appointment_id if request proceeds successfully with note (case 4 in the plot)', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Any appointment note, even blank one, is acceptable",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: aTimeCase18
                }],
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('appointment_id');

                    done();
                });
        });

        // Case 5 - OK: (CurrentAppointmentTime.End = SalonDailySchedule.End)
        /* 19
        */
        it('should return appointment_id if request proceeds successfully without note (case 5 in the plot)', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: aTimeCase19
                }],
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('appointment_id');
                    done();
                });
        });

        // Case 6 - ERROR: (AnotherAppointmentTime.End - CurrentAppointmentTime.Start) > Flexibale time
        /* 20
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which has overlapped time at the start side that is greater than the flexible time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceIdWithLongerTime,
                    employee_id: validEmployeeId,
                    start: aTimeCase20
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Case 7 - ERROR: (CurrentAppointmentTime.End - AnotherAppointmentTime.End) > Flexibale time
        /* 21
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which has overlapped time at the end side that is greater than the flexible time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceIdWithLongerTime,
                    employee_id: validEmployeeId,
                    start: aTimeCase21
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Case 8 - OK: (CurrentAppointmentTime.End - AnotherAppointmentTime.End) = Flexibale time
        /* 22
        */
        it('should return appointment_id if request proceeds successfully with note (case 8 in the plot)', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Any appointment note, even blank one, is acceptable",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: aTimeCase22
                }],
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('appointment_id');

                    done();
                });
        });

        // Case 9 - OK: (CurrentAppointmentTime.End - AnotherAppointmentTime.Start) = Flexibale time
        /* 23
        */
        it('should return appointment_id if request proceeds successfully with note (case 9 in the plot)', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Any appointment note, even blank one, is acceptable",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: aTimeCase23
                }],
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('appointment_id');

                    done();
                });
        });

        // Case 10 - ERROR: (AnotherAppointmentTime1.End - AnotherAppointmentTime2.Start = Flexibale time) AND (AnotherAppointmentTime2.End - CurrentAppointmentTime.Start = Flexibale time)
        /* 24
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which overlaps on the start side with another already overlapped appointment ', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: aTimeCase24
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Case 11 - ERROR: (AnotherAppointmentTime1.End - AnotherAppointmentTime2.Start = Flexibale time) AND (CurrentAppointmentTime.End - AnotherAppointmentTime1.Start = Flexibale time)
        /* 25
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which overlaps on the end side with another already overlapped appointment ', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: aTimeCase25
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Case 12 - OK: (CurrentAppointmentTime.Start > AnotherAppointmentTime1.End) AND (CurrentAppointmentTime.End < AnotherAppointmentTime2.Start)
        /* 26
        */
        it('should return appointment_id if request proceeds successfully with note (case 12 in the plot)', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Any appointment note, even blank one, is acceptable",
                "services": [{
                    service_id: validServiceIdWithShorterTime,
                    employee_id: validEmployeeId,
                    start: aTimeCase261
                }, {
                    service_id: validServiceIdWithLongerTime,
                    employee_id: validEmployeeId,
                    start: aTimeCase262
                }],
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('appointment_id');
                    done();
                });
        });

        // Case 13 - ERROR: (CurrentAppointmentTime.Start > AnotherAppointmentTime.Start) AND (CurrentAppointmentTime.End < AnotherAppointmentTime.End)
        /* 27
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which is totally within another appointment ', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceIdWithShorterTime,
                    employee_id: validEmployeeId,
                    start: aTimeCase27
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Case 14 - ERROR: (CurrentAppointmentTime.Start < AnotherAppointmentTime.Start) AND (CurrentAppointmentTime.End > AnotherAppointmentTime.End)
        /* 28
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which total wraps another appointment ', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceIdWithLongerTime,
                    employee_id: validEmployeeId,
                    start: aTimeCase28
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        // Case 15 - ERROR: ((CurrentAppointmentTime.Start > AnotherAppointmentTime1.End) < Flexible time) AND ((CurrentAppointmentTime.End < AnotherAppointmentTime2.Start) < Flexible time)
        /* 29
        */
        it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which overlaps other appointments on both side ', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: validServiceIdWithLongerTime,
                    employee_id: validEmployeeId,
                    start: aTimeCase29
                }]
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.BookingTimeNotAvailable.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });



    });
    describe('Unit Test Get Available Booking Time', function () {
        var apiUrl = '/api/v1/appointment/getavailablebookingtime';
        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' trying to get available booking time without salon id', function (done) {
            var para = '?service_list[]=' + validServiceId + '&service_list[]=' + validServiceIdWithLongerTime + '&date=2017-02-28%2010:45:00&employee_id=' + validEmployeeId;
            request(server)
                .get(apiUrl + para)
                .set({ 'Authorization': null })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingSalonId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' trying to get available booking time with invalid salon id', function (done) {
            var para = '?salon_id=' + invalidSalonId + '&service_list[]=' + validServiceId + '&service_list[]=' + validServiceIdWithLongerTime + '&date=2017-02-28%2010:45:00&employee_id=' + validEmployeeId;
            request(server)
                .get(apiUrl + para)
                .set({ 'Authorization': null })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });
        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' trying to get available booking time with invalid employee id', function (done) {
            var para = '?salon_id=' + validSalonId + '&?service_list[]=' + validServiceId + '&service_list[]=' + validServiceIdWithLongerTime + '&date=2017-02-28%2010:45:00&employee_id=' + invalidEmployeeId;
            request(server)
                .get(apiUrl + para)
                .set({ 'Authorization': null })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingStartDate.err.name + ' trying to get available booking time without date', function (done) {
            var para = '?salon_id=' + validSalonId + '&service_list[]=' + validServiceId + '&service_list[]=' + validServiceIdWithLongerTime + '&employee_id=' + validEmployeeId;
            request(server)
                .get(apiUrl + para)
                .set({ 'Authorization': null })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingStartDate.err.name);
                    done();
                });
        });
        it('should return ' + ErrorMessage.WrongBookingTimeFormat.err.name + ' trying to get avaliable booking time with invalid date', function (done) {
            var para = '?salon_id=' + validSalonId + '&service_list[]=' + validServiceId + '&service_list[]=' + validServiceIdWithLongerTime + '&date=2017-15-28%2010:40h5:00&employee_id=' + validEmployeeId;
            request(server)
                .get(apiUrl + para)
                .set({ 'Authorization': null })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.WrongBookingTimeFormat.err.name);
                    done();
                });
        });
        it('should return ' + ErrorMessage.MissingServiceId.err.name + 'trying to get available booking time without service id ', function (done) {
            var para = '?salon_id=' + validSalonId + '&date=2017-02-28%2010:45:00&employee_id=' + validEmployeeId;
            request(server)
                .get(apiUrl + para)
                .set({ 'Authorization': null })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingServiceId.err.name);
                    done();
                });
        });
        it('should return ' + ErrorMessage.ServiceNotFound.err.name + 'trying to get available booking time with invalid service id ', function (done) {
            var para = '?salon_id=' + validSalonId + '&service_list[]=' + invalidServiceId + '&date=2017-02-28%2010:45:00&employee_id=' + validEmployeeId;
            request(server)
                .get(apiUrl + para)
                .set({ 'Authorization': null })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.ServiceNotFound.err.name);
                    done();
                });
        });
        it('should return data if successfully get available booking time ', function (done) {
            var para = '?salon_id=' + validSalonId + '&?service_list[]=' + validServiceId + '&service_list[]=' + validServiceIdWithLongerTime + '&date=2017-02-28%2010:45:00&employee_id=' + validEmployeeId;
            request(server)
                .get(apiUrl + para)
                .set({ 'Authorization': null })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    res.body.should.have.property('data');
                    res.body.data.should.have.length.above(0);
                    res.body.data[0].should.have.property('time');
                    res.body.data[0].should.have.property('status');
                    done();
                });
        });

    });
})