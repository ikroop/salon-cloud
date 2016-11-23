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
import { ByPhoneVerification } from './../src/Core/Verification/ByPhoneVerification';
import { EmployeeInput, EmployeeReturn } from './../src/Modules/UserManagement/EmployeeData';
import { UserToken } from './../src/Core/Authentication/AuthenticationData';
import { SalonCloudResponse } from './../src/Core/SalonCloudResponse';
import { SalonInformation } from './../src/Modules/SalonManagement/SalonData'
import * as moment from 'moment';

describe('Schedule Management', function() {
    var validToken;
    var invalidToken = 'eyJhbGciOiJSUz';
    var validSalonId;
    var invalidSalonId = "5825e0365193422";
    var notFoundSalonId = "5825e03651934227174513d8";
    var defaultPassword = '1234@1234';
    var validEmployeeId;
    const today: moment.Moment = moment();
    var startDateMoment = today.add(1, 'months');
    var endDateMoment = startDateMoment.add(1, 'month');
    var totalDays = endDateMoment.diff(startDateMoment, 'days');

    before(async function() {

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
        var signedInUser = new SignedInUser(loginData.data.user._id, new SalonManagement(undefined));
        var salonInformationInput: SalonInformation = {
            email: 'salon@salon.com',
            phone: {
                number: '7703456789',
                is_verified: false
            },
            location: {
                address: '2506 Bailey Dr NW, Norcross, GA 30071',
                is_verified: false,
                timezone_id: undefined
            },
            salon_name: 'Salon Appointment Test'
        }
        var salon: any = await signedInUser.createSalon(salonInformationInput);

        validSalonId = salon.data.salon_id;
        // 4. Add new employee
        const owner = new Owner(loginData.data.user._id, salon.data.salon_id);
        // Add new employee
        const employeeInput: EmployeeInput = {
            salon_id: validSalonId,
            role: 2,
            phone: "7703456789",
            fullname: "Jimmy Tran",
            nickname: "Jimmy",
            salary_rate: 0.6,
            cash_rate: 0.6
        };
        const employeeEmail = `${Math.random().toString(36).substring(7)}@gmail.com`;
        const employee: SalonCloudResponse<EmployeeReturn> = await owner.addEmployee(employeeEmail, employeeInput, new ByPhoneVerification());
        validEmployeeId = employee.data.uid;
    });

    describe('Get Salon Daily Schedule', function() {
        var apiUrl = '/api/v1/schedule/getsalondailyschedules';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to get salon daily schedule with invalidToken', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': invalidToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to get salon daily schedule with Token no permission', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var token = loginData.data.auth.token;

            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': token })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get salon daily schedule without salonId', function(done) {
            var salonId = undefined;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get salon daily schedule with invalidSalonId', function(done) {
            var salonId = '32daed334dsfe';
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingStartDate.err.name + ' error trying to get salon daily schedule without start_date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingStartDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingEndDate.err.name + ' error trying to get salon daily schedule without end_date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingEndDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidStartDate.err.name + ' error trying to get salon daily schedule with invalid start_date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidEndDate.err.name + ' error trying to get salon daily schedule with invalid end_date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidEndDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EndDateLessThanStartDate.err.name + ' error trying to get salon daily schedule with invalid End Date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-11-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EndDateLessThanStartDate.err.name);
                    done();
                });
        });

        it('should return daily Schedule data trying to get salon daily schedule successfully', function(done) {
            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('daily_schedules');
                    res.body.daily_schedules.length.shoule.be.equal(totalDays);
                    done();
                });
        });

    });

    describe('Get Salon Weekly Schedule', function() {
        var apiUrl = '/api/v1/schedule/getsalonweeklyschedules';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to get Salon Weekly schedule with invalidToken', function(done) {

            var salonId = validSalonId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': invalidToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to get Salon Weekly schedule with Token no permission', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var token = loginData.data.auth.token;
            var salonId = validSalonId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': token })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get Salon Weekly schedule without salonId', function(done) {
            var salonId = undefined;
            var parameterUrl = apiUrl + '?salon_id=' + salonId
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get Salon Weekly schedule with invalidSalonId', function(done) {
            var salonId = '32daed334dsfe';
            var parameterUrl = apiUrl + '?salon_id=' + salonId
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return Weekly Schedule data trying to get Salon Weekly schedule successfully', function(done) {
            var salonId = validSalonId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('weekly_schedules');
                    res.body.weekly_schedules.length.shoule.be.equal(7);
                    done();
                });
        });

    });

    describe('Save Salon Daily Schedule', function() {
        var apiUrl = '/api/v1/schedule/savesalondailyschedules';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to save salon daily schedule with invalidToken', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': invalidToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to save salon daily schedule with Token no permission', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var token = loginData.data.auth.token;

            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save salon daily schedule without salonId', function(done) {
            var salonId = undefined;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save salon daily schedule with invalidSalonId', function(done) {
            var salonId = '32daed334dsfe';
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingDate.err.name + ' error trying to save salon daily schedule without date', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDate.err.name + ' error trying to save salon daily schedule with invalid date', function(done) {
            var salonId = validSalonId;
            var date = '2016-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon daily schedule without open_time', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = undefined;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon daily schedule with invalid open_time', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = -1;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon daily schedule with invalid open_time', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 24 * 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save salon daily schedule without close_time', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save salon daily schedule with invalid close_time', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var closeTime = -1;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save salon daily schedule with invalid close_time', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var closeTime = 24 * 3600;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to save salon daily schedule with open_time is greater than close_time', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 72000;
            var closeTime = 36000;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.OpenTimeGreaterThanCloseTime.err.name);
                    done();
                });
        });

        it('should return schedule data trying to save salon daily schedule successfully', function(done) {
            var salonId = validSalonId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var closeTime = 72000;
            var bodyRequest = {
                "salon_id": salonId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    done();
                });
        });

    });

    describe('Save Salon Weekly Schedule', function() {
        var apiUrl = '/api/v1/schedule/savesalondailyschedules';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to save salon weekly schedule with invalidToken', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': invalidToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to save salon weekly schedule with Token no permission', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var token = loginData.data.auth.token;

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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save salon weekly schedule without salonId', function(done) {
            var salonId = undefined;
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save salon weekly schedule with invalidSalonId', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingDayOfWeek.err.name + ' error trying to save salon weekly schedule without day_of_week', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDayOfWeek.err.name + ' error trying to save salon weekly schedule with invalid day_of_week', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 8
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDayOfWeek.err.name + ' error trying to save salon weekly schedule with invalid day_of_week', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": -1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.DuplicateDaysOfWeek.err.name + ' error trying to save salon weekly schedule with duplicate day_of_week', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.DuplicateDaysOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon weekly schedule without open_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon weekly schedule with invalid open_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": 24 * 3600,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save salon weekly schedule with invalid open_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": -1,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save salon weekly schedule without close_time', function(done) {
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
                            "open_time": openTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save salon weekly schedule with invalid close_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": 24 * 3600,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save salon weekly schedule with invalid close_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": -1,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to save salon weekly schedule with open_time is greater than close_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": 72000,
                            "close_time": 36000,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.OpenTimeGreaterThanCloseTime.err.name);
                    done();
                });
        });

        it('should return schedule data trying to save salon weekly schedule successfully', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    done();
                });
        });

    });

    describe('Get Employee Daily Schedule', function() {
        var apiUrl = '/api/v1/schedule/getsalondailyschedules';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to Get Employee Daily schedule with invalidToken', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': invalidToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to Get Employee Daily schedule with Token no permission', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var token = loginData.data.auth.token;
            var employeeId = validEmployeeId;
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': token })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to Get Employee Daily schedule without salonId', function(done) {
            var salonId = undefined;
            var employeeId = validEmployeeId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to Get Employee Daily schedule with invalidSalonId', function(done) {
            var salonId = '32daed334dsfe';
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingEmployeeId.err.name + ' error trying to Get Employee Daily schedule without employee id', function(done) {
            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingEmployeeId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', function(done) {
            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var employeeId = '123daef4dc4';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var userId = loginData.data.user._id;

            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var employeeId = userId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });


        it('should return ' + ErrorMessage.MissingStartDate.err.name + ' error trying to Get Employee Daily schedule without start_date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingStartDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingEndDate.err.name + ' error trying to Get Employee Daily schedule without end_date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-12-27';
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingEndDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidStartDate.err.name + ' error trying to Get Employee Daily schedule with invalid start_date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-15';
            var endDate = '2016-12-27';
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidEndDate.err.name + ' error trying to Get Employee Daily schedule with invalid end_date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-27';
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidEndDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EndDateLessThanStartDate.err.name + ' error trying to Get Employee Daily schedule with invalid End Date', function(done) {
            var salonId = validSalonId;
            var startDate = '2016-12-15';
            var endDate = '2016-11-27';
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EndDateLessThanStartDate.err.name);
                    done();
                });
        });

        it('should return daily Schedule data trying to Get Employee Daily schedule successfully', function(done) {
            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId + '&start_date=' + startDate + '&end_date=' + endDate;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('daily_schedules');
                    res.body.daily_schedules.length.shoule.be.equal(totalDays);
                    done();
                });
        });

    });

    describe('Get Employee Weekly Schedule', function() {
        var apiUrl = '/api/v1/schedule/getemployeeweeklyschedules';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to get Employee Weekly schedule with invalidToken', function(done) {

            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': invalidToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to get Employee Weekly schedule with Token no permission', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var token = loginData.data.auth.token;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': token })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get Employee Weekly schedule without salonId', function(done) {
            var salonId = undefined;
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get Employee Weekly schedule with invalidSalonId', function(done) {
            var salonId = '32daed334dsfe';
            var employeeId = validEmployeeId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingEmployeeId.err.name + ' error trying to Get Employee Daily schedule without employee id', function(done) {
            var salonId = validSalonId;

            var parameterUrl = apiUrl + '?salon_id=' + salonId;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingEmployeeId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', function(done) {
            var salonId = validSalonId;
            var employeeId = '123daef4dc4';
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var userId = loginData.data.user._id;

            var salonId = validSalonId;
            var startDate = startDateMoment.format('YYYY-MM-DD');
            var endDate = endDateMoment.format('YYYY-MM-DD');
            var employeeId = userId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });

        it('should return Weekly Schedule data trying to get Employee Weekly schedule successfully', function(done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var parameterUrl = apiUrl + '?salon_id=' + salonId + '&employee_id=' + employeeId;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('weekly_schedules');
                    res.body.weekly_schedules.length.shoule.be.equal(7);
                    done();
                });
        });

    });

    describe('Save Employee Daily Schedule', function() {
        var apiUrl = '/api/v1/schedule/savesalondailyschedules';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to save Employee Daily schedule with invalidToken', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': invalidToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to save Employee Daily schedule with Token no permission', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var token = loginData.data.auth.token;

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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save Employee Daily schedule without salonId', function(done) {
            var salonId = undefined;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save Employee Daily schedule with invalidSalonId', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingEmployeeId.err.name + ' error trying to save Employee Daily schedule without employee id', function(done) {
            var salonId = validSalonId;

            var employeeId = undefined;
            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingEmployeeId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to Get Employee Daily schedule with invalid employee id', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get User Id
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var userId = loginData.data.user._id;

            var salonId = validSalonId;

            var date = '2016-12-27';
            var status = true;
            var openTime = 3600;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": userId,
                "status": status,
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingDate.err.name + ' error trying to save Employee Daily schedule without date', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDate.err.name + ' error trying to save Employee Daily schedule with invalid date', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Daily schedule without open_time', function(done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = undefined;
            var closeTime = 7200;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Daily schedule with invalid open_time', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Daily schedule with invalid open_time', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save Employee Daily schedule without close_time', function(done) {
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = '2016-12-27';
            var status = true;
            var openTime = 36000;
            var bodyRequest = {
                "salon_id": salonId,
                "employee_id": employeeId,
                "status": status,
                "open_time": openTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save Employee Daily schedule with invalid close_time', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save Employee Daily schedule with invalid close_time', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to save Employee Daily schedule with open_time is greater than close_time', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.OpenTimeGreaterThanCloseTime.err.name);
                    done();
                });
        });

        it('should return schedule data trying to save Employee Daily schedule successfully', function(done) {
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
                "open_time": openTime,
                "close_time": closeTime,
                "date": date
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    done();
                });
        });

    });

    describe('Save Employee Weekly Schedule', function() {
        var apiUrl = '/api/v1/schedule/savesalondailyschedules';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to save Employee Weekly schedule with invalidToken', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': invalidToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to save Employee Weekly schedule with Token no permission', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get Token
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var token = loginData.data.auth.token;

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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save Employee Weekly schedule without salonId', function(done) {
            var salonId = undefined;
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to save Employee Weekly schedule with invalidSalonId', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingEmployeeId + ' error trying to save Employee Weekly schedule without employee_id', function(done) {
            var salonId = validSalonId;
            var employeeId = undefined;

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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingEmployeeId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to save Employee Weekly schedule with invalid Emplopyee Id', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to save Employee Weekly schedule with invalid EmployeeId', async function(done) {
            // Create new user
            var authentication = new Authentication();
            const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
            await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
            // Get User Id
            var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
            var employeeId = loginData.data.user._id;
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingDayOfWeek.err.name + ' error trying to save Employee Weekly schedule without day_of_week', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDayOfWeek.err.name + ' error trying to save Employee Weekly schedule with invalid day_of_week', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 8
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDayOfWeek.err.name + ' error trying to save Employee Weekly schedule with invalid day_of_week', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": -1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.DuplicateDaysOfWeek.err.name + ' error trying to save Employee Weekly schedule with duplicate day_of_week', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.DuplicateDaysOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Weekly schedule without open_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "close_time": closeTime,
                            "day_of_week": 1
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Weekly schedule with invalid open_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": 24 * 3600,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to save Employee Weekly schedule with invalid open_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": -1,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save Employee Weekly schedule without close_time', function(done) {
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
                            "open_time": openTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save Employee Weekly schedule with invalid close_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": 24 * 3600,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to save Employee Weekly schedule with invalid close_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": -1,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to save Employee Weekly schedule with open_time is greater than close_time', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": 72000,
                            "close_time": 36000,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.OpenTimeGreaterThanCloseTime.err.name);
                    done();
                });
        });

        it('should return schedule data trying to save Employee Weekly schedule successfully', function(done) {
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
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 0
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 2
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 3
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 4
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 5
                        },
                        {
                            "status": status,
                            "open_time": openTime,
                            "close_time": closeTime,
                            "day_of_week": 6
                        }
                    ]
                };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    done();
                });
        });

    });
});