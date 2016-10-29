var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var configDB = require('./../Services/Database.js');
var ErrorMessage = require('./../Core/ErrorMessage');

describe('Schedule', function () {
    var url = 'http://localhost:3000';
    var validToken;
    var invalidToken;
    var validSalonId;
    var invalidSalonId;
    var validInsertDate;
    var invalidInsertDate;
    var validWS1, validWS2,  validWS3, validWS4, validWS5, validWS6;
    var defaultPassword = '1234@1234'

    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function (done) {
        // In our tests we use the test db
        //mongoose.connect(configDB.url);
        var user = {
            username: 'unittest1472245629435@gmail.com',
            password: defaultPassword
        };
        request(url)
            .post('/api/v1/authentication/signinwithemailandpassword')
            .send(user)
            // end handles the response
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                validToken = res.body.auth.token;
                invalidToken = 'eyJhbGciOiJSUz';
                validSalonId = '57ba6280f531d1b53d54a6e5';
                invalidSalonId = 'invaliddddd';
                //Todo: sample employeeId
                validEmployeeId = '';
                invalidEmployeeId = 'invaliddddddd';
                validInsertDate = (new Date()) + 10000;
                invalidInsertDate = (new Date()) - 10000;
                validWS1 = {
                     'status': true,
                     'day_of_week': 1,
                     'open': 32000,
                     'close': 72000,
                };
                validWS2 = {
                     'status': true,
                     'day_of_week': 2,
                     'open': 32000,
                     'close': 72000,
                };
                validWS3 = {
                     'status': true,
                     'day_of_week': 3,
                     'open': 32000,
                     'close': 72000,
                };
                validWS4 = {
                     'status': true,
                     'day_of_week': 4,
                     'open': 32000,
                     'close': 72000,
                };
                validWS5 = {
                     'status': true,
                     'day_of_week': 5,
                     'open': 32000,
                     'close': 72000,
                };                
                validWS6 = {
                     'status': true,
                     'day_of_week': 6,
                     'open': 32000,
                     'close': 72000,
                };
                
                done();
            });


    });

    describe('Get Salon Daily Schedules', function () {
        var apiUrl = '/schedule/getsalondailyschedules';

        it('should return "InvalidTokenError" error trying to request with invalid token', function (done) {
            // TODO: discuss
            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidTokenError');
                    done();
                });
        });

        it('should return "NoPermission" error trying to request with unauthorized acc', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('NoPermission');
                    done();
                });
        });

        it('should return "SalonNotFound" error trying to request with no salonId param', function (done) {

            apiUrl = apiUrl + ':start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('SalonNotFound');
                    done();
                });
        });

        it('should return "SalonNotFound" error trying to request with not-found salonId', function (done) {

            apiUrl = apiUrl + ':salon_id=blabla&start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('SalonNotFound');
                    done();
                });
        });

        it('should return "MissingStartDate" error trying to request with no start-date param', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingStartDate');
                    done();
                });
        });

        it('should return "InvalidStartDate" error trying to request with invalid start-date', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=000000&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidStartDate');
                    done();
                });
        });

        it('should return "MissingEndDate" error trying to request with no end-date param', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=<start_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingEndDate');
                    done();
                });
        });

        it('should return "InvalidEndDate" error trying to request with invalid end-date', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=<start_date>&end_date=1111111';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidEndDate');
                    done();
                });
        });

        it('should return "InvalidEndDateForStartDate" error trying to request with  end-date < start-date', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=11111111&end_date=0000000';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidEndDateForStartDate');
                    done();
                });
        });
    });

    describe('Get Employee Daily Schedules', function () {
        var apiUrl = '/schedule/getemployeedailyschedules';

        it('should return "InvalidTokenError" error trying to request with invalid token', function (done) {
            // TODO: discuss
            apiUrl = apiUrl + '?employee_id=<employee_id>&start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidTokenError');
                    done();
                });
        });

        it('should return "NoPermission" error trying to request with unauthorized acc', function (done) {

            apiUrl = apiUrl + ':employee_id=<employee_id>&start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('NoPermission');
                    done();
                });
        });

        it('should return "EmployeeNotFound" error trying to request with no employeeId param', function (done) {

            apiUrl = apiUrl + ':start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('EmployeeNotFound');
                    done();
                });
        });

        it('should return "SalonNotFound" error trying to request with not-found salonId', function (done) {

            apiUrl = apiUrl + ':employee_id=blabla&start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('EmployeeNotFound');
                    done();
                });
        });

        it('should return "MissingStartDate" error trying to request with no start-date param', function (done) {

            apiUrl = apiUrl + ':employee_id=<employee_id>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingStartDate');
                    done();
                });
        });

        it('should return "InvalidStartDate" error trying to request with invalid start-date', function (done) {

            apiUrl = apiUrl + ':employee_id=<employee_id>&start_date=000000&end_date=<end_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidStartDate');
                    done();
                });
        });

        it('should return "MissingEndDate" error trying to request with no end-date param', function (done) {

            apiUrl = apiUrl + ':employee_id=<employee_id>&start_date=<start_date>';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingEndDate');
                    done();
                });
        });

        it('should return "InvalidEndDate" error trying to request with invalid end-date', function (done) {

            apiUrl = apiUrl + ':employee_id=<employee_id>&start_date=<start_date>&end_date=1111111';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidEndDate');
                    done();
                });
        });

        it('should return "InvalidEndDateForStartDate" error trying to request with  end-date < start-date', function (done) {

            apiUrl = apiUrl + ':employee_id=<employee_id>&start_date=11111111&end_date=0000000';

            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidEndDateForStartDate');
                    done();
                });
        });
    });

    describe('Save Salon Weekly Schedule', function () {
        var apiUrl = '/api/v1/schedule/savesalonweeklyschedule';


        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
                
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('TODO spec: should return ' + ErrorMessage.NoPermission.err.name + ' error trying to request with unauthorized acc', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to request with not-found salonId', function (done) {
            var token = validToken;
            var salonId = invalidSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });
        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to request without salonId', function (done) {
            var token = validToken;
            var salonId = invalidSalonId;
            var bodyRequest = {
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingSalonId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleOpenTime.err.name + ' error trying to request without open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with negative open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': -98,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with not-an-integer open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 'string is not an integer',
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with open time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 86401,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleCloseTime.err.name + ' error trying to request without open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with negative close time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': -98,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with not-an-integer close time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 'string is not an integer',
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with close time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 86401,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to request with close time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 72000,
                    'close': 36000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.CloseTimeGreaterThanOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleDayOfWeek.err.name + ' error trying to request without day_of_week', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleDayOfWeek.err.name + ' error trying to request with day_of_week equal 7', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 7,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongNumberOfDaysOfWeek.err.name + ' error trying to request with only 6 schedules', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongNumberOfDaysOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.DuplicateDaysOfWeek.err.name + ' error trying to request with 2 identical day_of_week', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [validWS1, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.DuplicateDaysOfWeek.err.name);
                    done();
                });
        });


        it('should return code 200 when schedule inserted successfully', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 35900,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(200);
                    res.body.should.not.have.property('err');
                    done();
                });
        });




    });

    describe('Save Employee Weekly Schedule', function () {
        var apiUrl = '/api/v1/schedule/saveemployeeweeklyschedule';


        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
                
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('TODO spec: should return ' + ErrorMessage.NoPermission.err.name + ' error trying to request with unauthorized acc', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to request with not-found salonId', function (done) {
            var token = validToken;
            var salonId = invalidSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });
        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to request without salonId', function (done) {
            var token = validToken;
            var salonId = invalidSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingSalonId.err.name);
                    done();
                });
        });

        it('TODO spec: employeeID missing error trying to request with unauthorized acc', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('TODO spec: employeeID not found error trying to request with unauthorized acc', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });
        
        it('should return ' + ErrorMessage.MissingScheduleOpenTime.err.name + ' error trying to request without open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with negative open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': -98,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with not-an-integer open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 'string is not an integer',
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with open time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 86401,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleCloseTime.err.name + ' error trying to request without open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with negative close time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': -98,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with not-an-integer close time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 'string is not an integer',
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with close time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 36000,
                    'close': 86401,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to request with close time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 72000,
                    'close': 36000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.CloseTimeGreaterThanOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleDayOfWeek.err.name + ' error trying to request without day_of_week', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleDayOfWeek.err.name + ' error trying to request with day_of_week equal 7', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 7,
                    'open': 36000,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleDayOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongNumberOfDaysOfWeek.err.name + ' error trying to request with only 6 schedules', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongNumberOfDaysOfWeek.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.DuplicateDaysOfWeek.err.name + ' error trying to request with 2 identical day_of_week', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [validWS1, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.DuplicateDaysOfWeek.err.name);
                    done();
                });
        });


        it('should return code 200 when schedule inserted successfully', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'weekly_schedules': [{
                    'status': true,
                    'day_of_week': 0,
                    'open': 35900,
                    'close': 72000,
                }, validWS1, validWS2, validWS3, validWS4, validWS5, validWS6]

            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(200);
                    res.body.should.not.have.property('err');
                    done();
                });
        });




    });

    describe('Save Salon Daily Schedule', function () {
        var apiUrl = '/api/v1/schedule/savesalondailyschedule';


        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 36000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('TODO spec: should return ' + ErrorMessage.NoPermission.err.name + ' error trying to request with unauthorized acc', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 36000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to request with not-found salonId', function (done) {
            var token = validToken;
            var salonId = invalidSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 36000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleOpenTime.err.name + ' error trying to request without open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'status': true,
                'date': date,
                'close': 72000,
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with negative open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': -98,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with not-an-integer open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 'string is not an integer',
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with open time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 86401,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleCloseTime.err.name + ' error trying to request without open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 32000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with negative close time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'close': -98,
                    'open': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with not-an-integer close time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'close': 'string is not an integer',
                    'open': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with close time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 32000,
                    'close': 86401,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to request with close time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 86000,
                    'close': 32000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.CloseTimeGreaterThanOpenTime.err.name);
                    done();
                });
        });


        it('should return ' + ErrorMessage.MissingScheduleDate.err.name + ' error trying to request without day_of_week', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'open': 32000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleDate.err.name + ' error trying to request with day_of_week equal 7', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = invalidInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 32000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleDate.err.name);
                    done();
                });
        });

        it('should return code 200 when schedule inserted successfully', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 32000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(200);
                    !res.body.should.have.property('err');
                    done();
                });
        });

    });

    describe('Save Employee Daily Schedule', function () {
        var apiUrl = '/api/v1/schedule/saveemployeedailyschedule';


        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 36000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('TODO spec: should return ' + ErrorMessage.NoPermission.err.name + ' error trying to request with unauthorized acc', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'status': true,
                'daily_schedule':{
                    'date': date,
                    'open': 36000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to request with not-found salonId', function (done) {
            var token = validToken;
            var salonId = invalidSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':
                {   'status': true,
                    'date': date,
                    'open': 36000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('TODO spec: employeeID missing error trying to request with unauthorized acc', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'employee_id': employeeId,
               
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('TODO spec: employeeID not found error trying to request with unauthorized acc', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'employee_id': employeeId,
                
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });
        

        it('should return ' + ErrorMessage.MissingScheduleOpenTime.err.name + ' error trying to request without open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':
                {   'status': true,
                    'date': date,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with negative open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': -98,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with not-an-integer open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 'string is not an integer',
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleOpenTime.err.name + ' error trying to request with open time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 86401,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleOpenTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingScheduleCloseTime.err.name + ' error trying to request without open time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 32000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with negative close time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var date = validInsertDate;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'close': -98,
                    'open': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with not-an-integer close time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'close': 'string is not an integer',
                    'open': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleCloseTime.err.name + ' error trying to request with close time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 32000,
                    'close': 86401,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleCloseTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.OpenTimeGreaterThanCloseTime.err.name + ' error trying to request with close time greater than 24*3600 = 86400', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 86000,
                    'close': 32000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.CloseTimeGreaterThanOpenTime.err.name);
                    done();
                });
        });


        it('should return ' + ErrorMessage.MissingScheduleDate.err.name + ' error trying to request without day_of_week', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'open': 32000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingScheduleDate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidScheduleDate.err.name + ' error trying to request with day_of_week equal 7', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = invalidInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 32000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidScheduleDate.err.name);
                    done();
                });
        });

        it('should return code 200 when schedule inserted successfully', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var date = validInsertDate;
            var employeeId = validEmployeeId;
            var bodyRequest = {
                'salon_id': salonId,
                'employee_id': employeeId,
                'daily_schedule':{
                    'status': true,
                    'date': date,
                    'open': 32000,
                    'close': 72000,}
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(200);
                    !res.body.should.have.property('err');
                    done();
                });
        });

    });

    describe('Get Salon Weeky Schedules', function () {
        var apiUrl = '/schedule/getsalonweeklyschedules';

        it('should return "InvalidTokenError" error trying to request with invalid token', function (done) {
            // TODO: discuss
            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via GET verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidTokenError');
                    done();
                });
        });

        it('should return "NoPermission" error trying to request with unauthorized acc', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via GET verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('NoPermission');
                    done();
                });
        });

        it('should return "SalonNotFound" error trying to request with no salonId param', function (done) {

            apiUrl = apiUrl + ':start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via GET verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('SalonNotFound');
                    done();
                });
        });

        it('should return "SalonNotFound" error trying to request with not-found salonId', function (done) {

            apiUrl = apiUrl + ':salon_id=blabla&start_date=<start_date>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via GET verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('SalonNotFound');
                    done();
                });
        });

        it('should return "MissingStartDate" error trying to request with no start-date param', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&end_date=<end_date>';

            // once we have specified the info we want to send to the server via GET verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingStartDate');
                    done();
                });
        });

        it('should return "InvalidStartDate" error trying to request with invalid start-date', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=000000&end_date=<end_date>';

            // once we have specified the info we want to send to the server via GET verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidStartDate');
                    done();
                });
        });

        it('should return "MissingEndDate" error trying to request with no end-date param', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=<start_date>';

            // once we have specified the info we want to send to the server via GET verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingEndDate');
                    done();
                });
        });

        it('should return "InvalidEndDate" error trying to request with invalid end-date', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=<start_date>&end_date=1111111';

            // once we have specified the info we want to send to the server via GET verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidEndDate');
                    done();
                });
        });

        it('should return "InvalidEndDateForStartDate" error trying to request with  end-date < start-date', function (done) {

            apiUrl = apiUrl + ':salon_id=<salon_id>&start_date=11111111&end_date=0000000';

            // once we have specified the info we want to send to the server via GET verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // We do this using the request object, requiring supertest!
            request(url)
                .get(apiUrl)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidEndDateForStartDate');
                    done();
                });
        });
    });
});