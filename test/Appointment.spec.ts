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
import { ByPhoneVerification } from './../src/Core/Verification/ByPhoneVerification';
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

        validSalonId = salon.data;
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
        const employee: SalonCloudResponse<EmployeeReturn> = await owner.addEmployee(employeeEmail, employeeInput, new ByPhoneVerification());
        console.log('EmPloyeEE: ', employee);
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
        console.log('SERVICES: ', service_array.data[0].service_list, service_array.data[1].service_list);

        // Get Daily Schedule
        const employeeSchedule = new EmployeeSchedule(validSalonId, validEmployeeId);

        //employeeDailySchedule = EmployeeSchedule.getDailySchedule()
        var salonTime = new SalonTime();
        // set date to SalonTime Object
        const employeeDailySchedule = await employeeSchedule.getDailySchedule(salonTime, salonTime);

        employeeScheduleOpenTime = employeeDailySchedule.data.days[0].open;
        employeeScheduleCloseTime = employeeDailySchedule.data.days[0].close;

        var aTimeCase15InSecond = employeeScheduleOpenTime - 70 * 60; //1
        var aTimeCase16InSecond = employeeScheduleCloseTime + 70 * 60; //2
        var aTimeCase17InSecond = employeeScheduleCloseTime - 10 * 60; //3
        var aTimeCase18InSecond = employeeScheduleOpenTime; //4
        var aTimeCase19InSecond = employeeScheduleCloseTime - 30 * 60; //5
        var aTimeCase20InSecond = employeeScheduleOpenTime + 10 * 60; //6
        var aTimeCase21InSecond = employeeScheduleCloseTime - 40 * 60; //7
        var aTimeCase22InSecond = employeeScheduleOpenTime + 15 * 60; //8
        var aTimeCase23InSecond = employeeScheduleCloseTime - 45 * 60; //9
        var aTimeCase24InSecond = employeeScheduleOpenTime + 45 * 60; //10
        var aTimeCase25InSecond = employeeScheduleCloseTime - 75 * 60; //11
        var aTimeCase261InSecond = employeeScheduleOpenTime + 90 * 60; //12
        var aTimeCase262InSecond = employeeScheduleOpenTime + 140 * 60; //12
        var aTimeCase27InSecond = employeeScheduleCloseTime - 95* 60; //13 Need a shorter Service Time
        var aTimeCase28InSecond = employeeScheduleOpenTime + 85 * 60; //14 Need a longer Service Time
        var aTimeCase29InSecond = employeeScheduleOpenTime + 115 * 60; //15

        
        function getDateString(dateString: string, time: number) : string{
            var date = moment(dateString,'YYYY-MM-DD HH:mm:ss');
            var hour = time/3600;
            var minute = time%3600/60;
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
        var test = getDateString(dateString,aTimeCase15);
        console.log('TEst: ', test);


    });

    describe('Unit Test Create Appointment By Phone', function () {
        var apiUrl = '/api/v1/appointment/createbyphone';

        /* 1	Invalid token	403	
                error : 
                    - name: 'InvalidTokenError' 
                    - message: 'Token is invalid'
        */
        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to create appointment with invalid token', function (done) {
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

                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to create appointment with no permission account', function (done) {
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

                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingUsername.err.name);
                    done();
                });
        });

        /* 3	Wrong Phone Number Format	400	
                error : 
                    - name: 'WrongPhoneNumberFormat' 
                    - message: 'Wrong Phone Number Format'
        */
        it('should return ' + ErrorMessage.NotEmailOrPhoneNumber.err.name + ' error trying to create appointment with wrong-formatted phone number', function (done) {
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NotEmailOrPhoneNumber.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingCustomerName.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidNameString.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingSalonId.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingBookedServiceList.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingServiceId.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.ServiceNotFound.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingEmployeeId.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongBookingTimeFormat.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongBookingTimeFormat.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongBookingTimeFormat.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongBookingTimeFormat.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongBookingTimeFormat.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongPhoneNumberFormat.err.name + ' error trying to create appointment which has no-minute booking_time', function (done) {
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongBookingTimeFormat.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
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
                    service_id: validServiceId,
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
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

                    res.status.should.be.equal(200);
                    res.body.should.have.property('appointment_id');
                    done();
                });
        });
        
        // Case 5 - OK: (CurrentAppointmentTime.End = SalonDailySchedule.End)
        /* 19
        */
        it('should return appointment_id if request proceeds successfully with note (case 5 in the plot)', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Any appointment note, even blank one, is acceptable",
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

                    res.status.should.be.equal(200);
                    res.body.should.have.property('appointment_id');
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
                    service_id: validServiceId,
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
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
                    service_id: validServiceId,
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
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

                    res.status.should.be.equal(200);
                    res.body.should.have.property('appointment_id');
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

                    res.status.should.be.equal(200);
                    res.body.should.have.property('appointment_id');
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
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
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: aTimeCase261
                },{
                    service_id: validServiceId,
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

                    res.status.should.be.equal(200);
                    res.body.should.have.property('appointment_id');
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
                    service_id: validServiceId,
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
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
                    service_id: validServiceId,
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
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
                    service_id: validServiceId,
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
                    done();
                });
        });



        /* 17	AppointmentTime.End > SalonDailySchedule.Close	400	
        //         error : 
        //             - name: 'AppointmentCanNotBeDoneWithinSalonWorkingTime' 
        //             - message: 'Appointment cannot be done within salon's working time'
        // */
        // it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which cannot be done within salon\'s working time', function (done) {
        //    var bodyRequest = {
        //        "customer_phone": rightFormattedPhoneNumber,
        //        "customer_name": rightFormattedName,
        //        "salon_id": validSalonId,
        //        "note": "Appointment note",
        //        "services": [{
        //            service_id: validServiceId,
        //            employee_id: validEmployeeId,
        //            start: aTimeCase17
        //        }]
        //    };
        //    request(server)
        //        .post(apiUrl)
        //        .send(bodyRequest)
        //        .set({ 'Authorization': validToken })
        //
        //       .end(function (err, res) {
        //            if (err) {
        //                throw err;
        //            }
        //
        //          res.status.should.be.equal(400);
        //            res.body.should.have.property('err');
        //            res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
        //            done();
        //        });
        // });

        // /* 18	currentAppointment.Start < anotherAppointment.End 	400	
        //         error : 
        //             - name: 'OverlapAnotherAppointmentEndTime' 
        //             - message: 'There is an un-finished appointment at appointment's start time!'
        // */
        // it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which has start time overlaps another appointment\'s end time', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": [{
        //             service_id: validServiceId,
        //             employee_id: notFoundEmployeeId
        //         }, {
        //             service_id: validServiceId,
        //             employee_id: validEmployeeId
        //         }]
        //     };
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
        //             done();
        //         });
        // });

        // /* 19	currentAppointment.End > (anotherAppointment.Start + delay)	400	
        //         error : 
        //             - name: 'OverlapAnotherAppointmentStartTime' 
        //             - message: 'There's an appointment that starts before this appointment ends!'
        // */
        // it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which has end time overlaps another appointment\'s start time', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": [{
        //             service_id: validServiceId,
        //             employee_id: notFoundEmployeeId
        //         }, {
        //             service_id: validServiceId,
        //             employee_id: validEmployeeId
        //         }]
        //     };
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
        //             done();
        //         });
        // });

        // /* 20	currentAppointment.Start < (anotherAppointment.End + delay) 	400	
        //         error : 
        //             - name: 'OverlapDelayedAppointmentEndTime' 
        //             - message: 'Appointment's start time may not be available since previous appointment may be delayed!'
        // */
        // it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which has start time may not be available since previous appointment may be delayed', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": [{
        //             service_id: validServiceId,
        //             employee_id: notFoundEmployeeId
        //         }, {
        //             service_id: validServiceId,
        //             employee_id: validEmployeeId
        //         }]
        //     };
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
        //             done();
        //         });
        // });

        // /* 21	currentAppointment.End > fix anotherAppointment.Start	400	
        //         error : 
        //             - name: 'OverlapAnotherAppointmentStartTimeFixed' 
        //             - message: 'Appointment's end time is not available since next appointment cannot be more delayed!'
        // */
        // it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which has end time may not available since next appointment cannot be more delayed', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": [{
        //             service_id: validServiceId,
        //             employee_id: notFoundEmployeeId
        //         }, {
        //             service_id: validServiceId,
        //             employee_id: validEmployeeId
        //         }]
        //     };
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
        //             done();
        //         });
        // });

        // /* 22	(currentAppointment.Start > anotherAppointment.Start) && (currentAppointment.End < anotherAppointment.End)	
        //         400	
        //         error : 
        //             - name: 'AppointmentTimeNotAvailable' 
        //             - message: 'Appointment time is not available!'
        // */
        // it('should return ' + ErrorMessage.AppointmentTimeNotAvailable.err.name + ' error trying to create appointment which has unavailable appointment_time', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": [{
        //             service_id: validServiceId,
        //             employee_id: notFoundEmployeeId
        //         }, {
        //             service_id: validServiceId,
        //             employee_id: validEmployeeId
        //         }]
        //     };
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.AppointmentTimeNotAvailable.err.name);
        //             done();
        //         });
        // });

        // /* 23	(anotherAppointment.Start > currentAppointment.Start) && (anotherAppointment.End < currentAppointment.End)	
        //         400	
        //         error : 
        //             - name: 'CompletelyOverlapAnotherAppointment' 
        //             - message: 'Another appointment has already been at that time!'
        // */
        // it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which completely overlaps another appointment', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": [{
        //             service_id: validServiceId,
        //             employee_id: notFoundEmployeeId
        //         }, {
        //             service_id: validServiceId,
        //             employee_id: validEmployeeId
        //         }]
        //     };
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
        //             done();
        //         });
        // });

        // /* 24	NotEnoughTimeForAppointment	
        //         400	
        //         error : 
        //             - name: 'NotEnoughTimeForAppointment' 
        //             - message: 'This appointment may not have enough time because of its previous & next appointments!'
        // */
        // it('should return ' + ErrorMessage.BookingTimeNotAvailable.err.name + ' error trying to create appointment which may have not enough time', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": [{
        //             service_id: validServiceId,
        //             employee_id: notFoundEmployeeId
        //         }, {
        //             service_id: validServiceId,
        //             employee_id: validEmployeeId
        //         }]
        //     };
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.BookingTimeNotAvailable.err.name);
        //             done();
        //         });
        // });

        // /* 25	InvalidAppointmentStartTime	
        //         400	
        //         error : 
        //             - name: 'InvalidAppointmentStartTime' 
        //             - message: 'This appointment has start time which is in the past!'
        // */
        // it('should return ' + ErrorMessage.InvalidAppointmentStartTime.err.name + ' error trying to create appointment which has start time in the past', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": [{
        //             service_id: validServiceId,
        //             employee_id: notFoundEmployeeId
        //         }, {
        //             service_id: validServiceId,
        //             employee_id: validEmployeeId
        //         }]
        //     };
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.InvalidAppointmentStartTime.err.name);
        //             done();
        //         });
        // });

        // /* 27	InvalidDataTypeService	
        //         400	
        //         error : 
        //             - name: 'InvalidDataTypeService' 
        //             - message: 'Invalid data type of booking time!'
        // */
        // it('should return ' + ErrorMessage.InvalidDataTypeService.err.name + ' error trying to create appointment which booking type data type is not Salon Time format', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": 33
        //     };
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.InvalidDataTypeService.err.name);
        //             done();
        //         });
        // });

        // /* 28	InvalidDataTypeBookingTime	
        //         400	
        //         error : 
        //             - name: 'InvalidDataTypeBookingTime' 
        //             - message: 'Invalid data type of booking time!'
        // */
        // it('should return ' + ErrorMessage.InvalidDataTypeBookingTime.err.name + ' error trying to create appointment which services data type is not an array', function (done) {
        //     var bodyRequest = {
        //         "customer_phone": rightFormattedPhoneNumber,
        //         "customer_name": rightFormattedName,
        //         "salon_id": validSalonId,
        //         "note": "Appointment note",
        //         "services": [{
        //             service_id: validServiceId,
        //             employee_id: validEmployeeId
        //         }]
        //     request(server)
        //         .post(apiUrl)
        //         .send(bodyRequest)
        //         .set({ 'Authorization': validToken })

        //         .end(function (err, res) {
        //             if (err) {
        //                 throw err;
        //             }

        //             res.status.should.be.equal(400);
        //             res.body.should.have.property('err');
        //             res.body.err.should.have.property('name').eql(ErrorMessage.InvalidDataTypeBookingTime.err.name);
        //             done();
        //         });
        // });

        it('should return appointment_id if request proceeds successfully with note', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Any appointment note, even blank one, is acceptable",
                "services": [{
                    service_id: validServiceId,
                    employee_id: validEmployeeId,
                    start: "2017-02-28 10:45:00"
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

                    res.status.should.be.equal(200);
                    res.body.should.have.property('appointment_id');
                    done();
                });
        });

        it('should return appointment_id if request proceeds successfully without note', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
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

                    res.status.should.be.equal(200);
                    res.body.should.have.property('appointment_id');
                    done();
                });
        });
    });
});