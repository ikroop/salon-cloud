/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import * as server from './Config';
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
import { EmployeeReturn } from './../src/Modules/UserManagement/EmployeeData';
import { UserToken } from './../src/Core/Authentication/AuthenticationData';
import { SalonCloudResponse } from './../src/Core/SalonCloudResponse';
import { SalonInformation } from './../src/Modules/SalonManagement/SalonData'
import * as moment from 'moment';
import { UserProfile } from './../src/Modules/UserManagement/UserData';

describe('Schedule Management', function () {
    let validToken;
    let invalidToken = 'eyJhbGciOiJSUz';
    let validSalonId;
    let invalidSalonId = "5825e0365193422";
    let notFoundSalonId = "5825e03651934227174513d8";
    let defaultPassword = '1234@1234';
    let validEmployeeId;
    let anotherUserId;
    let anotherUserToken;
    const today: moment.Moment = moment();
    let startDateMoment = moment().add(1, 'months');
    let endDateMoment = moment().add(2, 'month');
    let totalDays = endDateMoment.diff(startDateMoment, 'days') + 1;

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

    });

    describe('Get Salon Daily Schedule', function () {
        var apiUrl = '/api/v1/schedule/getsalondailyschedule';

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get salon daily schedule without salonId', function (done) {
            var salonId = null;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get salon daily schedule with invalidSalonId', function (done) {
            var salonId = '32daed334dsfe';
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.InvalidStartDate.err.name + ' error trying to get salon daily schedule without start_date', function (done) {
            var salonId = validSalonId;
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidStartDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidEndDate.err.name + ' error trying to get salon daily schedule without end_date', function (done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidEndDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidStartDate.err.name + ' error trying to get salon daily schedule with invalid start_date', function (done) {
            var salonId = validSalonId;
            var startDate = '2016-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidStartDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidEndDate.err.name + ' error trying to get salon daily schedule with invalid end_date', function (done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidEndDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EndDateIsBeforeStartDate.err.name + ' error trying to get salon daily schedule with invalid End Date', function (done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-11-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.EndDateIsBeforeStartDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return daily Schedule data trying to get salon daily schedule successfully', function (done) {
            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;

            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('days');
                    res.body.data.should.have.property('salon_id');
                    done();
                });
        });

    });

    describe('Get Salon Weekly Schedule', function () {
        var apiUrl = '/api/v1/schedule/getsalonweeklyschedule';

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get Salon Weekly schedule without salonId', function (done) {
            var salonId = null;
            var parameterUrl = apiUrl + '?salon_id=' + salonId
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get Salon Weekly schedule with invalidSalonId', function (done) {
            var salonId = '32daed334dsfe';
            var parameterUrl = apiUrl + '?salon_id=' + salonId
            request(server)
                .get(parameterUrl)
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

        it('should return Weekly Schedule data trying to get Salon Weekly schedule successfully', function (done) {
            var salonId = validSalonId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('week');
                    res.body.data.week.length.should.be.equal(7);
                    done();
                });
        });

    });

    describe('Save Salon Daily Schedule', function () {
        var apiUrl = '/api/v1/schedule/savesalondailyschedule';

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to save salon daily schedule with invalidToken', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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

        it('should return ' + ErrorMessage.Forbidden.err.name + ' error trying to save salon daily schedule with Token no permission', function (done) {

            var token = anotherUserToken;
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
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

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to save salon daily schedule without salonId', function (done) {
            var salonId = null;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save salon daily schedule with invalidSalonId', function (done) {
            var salonId = '32daed334dsfe';
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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

        it('should return ' + ErrorMessage.InvalidDate.err.name + ' error trying to save salon daily schedule without date', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDate.err.name + ' error trying to save salon daily schedule with invalid date', function (done) {
            var salonId = validSalonId;
            var date = '2016-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleOpenTime.err.name + ' error trying to save salon daily schedule without open_time', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = null;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon daily schedule with invalid open_time', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = -1;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon daily schedule with invalid open_time', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 24 * 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleCloseTime.err.name + ' error trying to save salon daily schedule without close_time', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save salon daily schedule with invalid close_time', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var closeTime = -1;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save salon daily schedule with invalid close_time', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var closeTime = 24 * 3600;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to save salon daily schedule with open_time is greater than close_time', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 72000;
            var closeTime = 36000;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.OpenTimeGreaterThanCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return schedule data trying to save salon daily schedule successfully', function (done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var closeTime = 72000;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.data.should.have.property('_id');
                    done();
                });
        });

    });


    describe('Save Salon Weekly Schedule', function () {
        var apiUrl = '/api/v1/schedule/savesalonweeklyschedule';

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to save salon weekly schedule with invalidToken', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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

        it('should return ' + ErrorMessage.Forbidden.err.name + ' error trying to save salon weekly schedule with Token no permission', function (done) {

            var token = anotherUserToken;
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
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

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to save salon weekly schedule without salonId', function (done) {
            var salonId = null;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save salon weekly schedule with invalidSalonId', function (done) {
            var salonId = '32daed334dsfe';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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

        it('should return ' + ErrorMessage.MissingDayOfWeek.err.name + ' error trying to save salon weekly schedule without day_of_week', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingDayOfWeek.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleDayOfWeek.err.name + ' error trying to save salon weekly schedule with invalid day_of_week', function (done) {
            var salonId = validSalonId;
            var date = '2016-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 8
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleDayOfWeek.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleDayOfWeek.err.name + ' error trying to save salon weekly schedule with invalid day_of_week', function (done) {
            var salonId = validSalonId;
            var date = '2016-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": -1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleDayOfWeek.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.DuplicateDaysOfWeek.err.name + ' error trying to save salon weekly schedule with duplicate day_of_week', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.DuplicateDaysOfWeek.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleOpenTime.err.name + ' error trying to save salon weekly schedule without open_time', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon weekly schedule with invalid open_time', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": 24 * 3600,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon weekly schedule with invalid open_time', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": -1,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleCloseTime.err.name + ' error trying to save salon weekly schedule without close_time', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save salon weekly schedule with invalid close_time', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": 24 * 3600,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to save salon weekly schedule with open_time is greater than close_time', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": 72000,
                            "close": 36000,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.OpenTimeGreaterThanCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return schedule data trying to save salon weekly schedule successfully', function (done) {
            var salonId = validSalonId;
            var status = true;
            var openTime = 36000;
            var closeTime = 72000;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    done();
                });
        });


    });

    describe('Get Employee Daily Schedule', function () {
        var apiUrl = '/api/v1/schedule/getemployeedailyschedule';

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to Get Employee Daily schedule without salonId', function (done) {
            var salonId = null;
            var employeeId = validEmployeeId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to Get Employee Daily schedule with invalidSalonId', function (done) {
            var salonId = '32daed334dsfe';
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.MissingEmployeeId.err.name + ' error trying to Get Employee Daily schedule without employee id', function (done) {
            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', function (done) {
            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var employeeId = '123daef4dc4';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', function (done) {

            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var employeeId = anotherUserId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.InvalidStartDate.err.name + ' error trying to Get Employee Daily schedule without start_date', function (done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidStartDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidEndDate.err.name + ' error trying to Get Employee Daily schedule without end_date', function (done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate;
            request(server)
                .get(parameterUrl)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidEndDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidStartDate.err.name + ' error trying to Get Employee Daily schedule with invalid start_date', function (done) {
            var salonId = validSalonId;
            var startDate = '2016-15';
            var endDate = '2016-12-27';
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidStartDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidEndDate.err.name + ' error trying to Get Employee Daily schedule with invalid end_date', function (done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-27';
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidEndDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EndDateIsBeforeStartDate.err.name + ' error trying to Get Employee Daily schedule with invalid End Date', function (done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-11-27';
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.EndDateIsBeforeStartDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return daily Schedule data trying to Get Employee Daily schedule successfully', function (done) {
            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(parameterUrl)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('days');
                    done();
                });
        });

    });

    describe('Get Employee Weekly Schedule', function () {
        var apiUrl = '/api/v1/schedule/getemployeeweeklyschedule';

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get Employee Weekly schedule without salonId', function (done) {
            var salonId = null;
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get Employee Weekly schedule with invalidSalonId', function (done) {
            var salonId = '32daed334dsfe';
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.MissingEmployeeId.err.name + ' error trying to Get Employee Daily schedule without employee id', function (done) {
            var salonId = validSalonId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', function (done) {
            var salonId = validSalonId;
            var employeeId = '123daef4dc4';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(parameterUrl)
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

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', function (done) {

            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var employeeId = anotherUserId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(parameterUrl)
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

        it('should return Weekly Schedule data trying to get Employee Weekly schedule successfully', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('week');
                    res.body.data.week.length.should.be.equal(7);
                    done();
                });
        });

    });

    describe('Save Employee Weekly Schedule', function () {
        var apiUrl = '/api/v1/schedule/saveemployeeweeklyschedule';

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to save Employee Weekly schedule with invalidToken', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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

        it('should return ' + ErrorMessage.Forbidden.err.name + ' error trying to save Employee Weekly schedule with Token no permission', function (done) {
            // Create new user
            var token = anotherUserToken;

            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
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

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to save Employee Weekly schedule without salonId', function (done) {
            var salonId = null;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save Employee Weekly schedule with invalidSalonId', function (done) {
            var salonId = '32daed334dsfe';
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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

        it('should return ' + ErrorMessage.MissingEmployeeId.err.name + ' error trying to save Employee Weekly schedule without employee_id', function (done) {
            var salonId = validSalonId;
            var employeeId = null;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to save Employee Weekly schedule with invalid Emplopyee Id', function (done) {
            var salonId = validSalonId;
            var employeeId = '1acd3fe3fab789ab';

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to save Employee Weekly schedule with invalid EmployeeId', function (done) {

            var employeeId = anotherUserId;
            var salonId = validSalonId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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

        it('should return ' + ErrorMessage.MissingDayOfWeek.err.name + ' error trying to save Employee Weekly schedule without day_of_week', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingDayOfWeek.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleDayOfWeek.err.name + ' error trying to save Employee Weekly schedule with invalid day_of_week', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var date = '2016-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 8
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleDayOfWeek.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleDayOfWeek.err.name + ' error trying to save Employee Weekly schedule with invalid day_of_week', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var date = '2016-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": -1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleDayOfWeek.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.DuplicateDaysOfWeek.err.name + ' error trying to save Employee Weekly schedule with duplicate day_of_week', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.DuplicateDaysOfWeek.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleOpenTime.err.name + ' error trying to save Employee Weekly schedule without open_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Weekly schedule with invalid open_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": 24 * 3600,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Weekly schedule with invalid open_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": -1,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleCloseTime.err.name + ' error trying to save Employee Weekly schedule without close_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save Employee Weekly schedule with invalid close_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": 24 * 3600,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to save Employee Weekly schedule with open_time is greater than close_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": 72000,
                            "close": 36000,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    res.body.error.name.should.be.equal(ErrorMessage.OpenTimeGreaterThanCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return schedule data trying to save Employee Weekly schedule successfully', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var status = true;
            var openTime = 36000;
            var closeTime = 72000;
            var bodyRequest =
                {
                    "salon_id": salonId,
                    "employee_id": employeeId,
                    "weekly_schedules":
                    [
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open": openTime,
                            "close": closeTime,
                            "day_of_week": 6
                        }
                    ]
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
                    done();
                });
        });

    });
    describe('Save Employee Daily Schedule', function () {
        var apiUrl = '/api/v1/schedule/saveemployeedailyschedule';

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to save Employee Daily schedule with invalidToken', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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

        it('should return ' + ErrorMessage.Forbidden.err.name + ' error trying to save Employee Daily schedule with Token no permission', function (done) {
            var token = anotherUserToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
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

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to save Employee Daily schedule without salonId', function (done) {
            var salonId = null;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save Employee Daily schedule with invalidSalonId', function (done) {
            var salonId = '32daed334dsfe';
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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

        it('should return ' + ErrorMessage.MissingEmployeeId.err.name + ' error trying to save Employee Daily schedule without employee id', function (done) {
            var salonId = validSalonId;

            var employeeId = null;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', function (done) {
            var salonId = validSalonId;
            var employeeId = '22cde4344fbc';
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', function (done) {
            // Create new user            
            var userId = anotherUserToken;

            var salonId = validSalonId;

            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": userId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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

        it('should return ' + ErrorMessage.InvalidDate.err.name + ' error trying to save Employee Daily schedule without date', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDate.err.name + ' error trying to save Employee Daily schedule with invalid date', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidDate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleOpenTime.err.name + ' error trying to save Employee Daily schedule without open_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = null;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Daily schedule with invalid open_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = -1;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Daily schedule with invalid open_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 24 * 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleCloseTime.err.name + ' error trying to save Employee Daily schedule without close_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save Employee Daily schedule with invalid close_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var closeTime = -1;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save Employee Daily schedule with invalid close_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var closeTime = 24 * 3600;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to save Employee Daily schedule with open_time is greater than close_time', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 72000;
            var closeTime = 36000;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.error.name.should.be.equal(ErrorMessage.OpenTimeGreaterThanCloseTime.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return schedule data trying to save Employee Daily schedule successfully', function (done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var closeTime = 72000;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open": openTime,
                "close": closeTime,
                "date": date
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
                    res.body.data.should.have.property('_id');
                    done();
                });
        });

    });

});