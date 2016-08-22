var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var configDB = require('./../config/dev/database.js');

describe('Schedule', function () {
    var url = 'http://localhost:3000';
    var validToken;
    var invalidToken;
    var defaultPassword = '1234@1234'

    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function (done) {
        // In our tests we use the test db
        mongoose.connect(configDB.url);
        var user = {
            username: 'unittest1471723005545@gmail.com',
            password: defaultPassword
        };
        /*request(url)
            .post('/auth/signinwithemailandpassword')
            .send(user)
            // end handles the response
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                validToken = res.auth.token;
                invalidToken = validToken + '1';
                done();
            });*/
        validToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3YjhiNWZkYmIxYjRiMDkwY2MxN2EyOCIsImNyZWF0ZWRfYXQiOjE0NzE3Mjk0ODQyMjIsImlhdCI6MTQ3MTcyOTQ4NH0.aq_3rcu62_Jt1LOIDBi16lXshwCj62DspgOnBVqcABO0y8rZ5qlGm0KnjwnwnuayWuruICpgPiVMHlhKrcUFvfEctFEmHJFyqCabmBvZCFWkwnK7zOGbKxh72BJKDYPjZ1JL4PCsZWMYZpVkca8iU_ILIrZlaUnobqUe1rwpBbUwTT-4NBNEarjuJhVleJSouCaJOFANLXf0ikyMhzGzef78Ja3rrZBg5Ivq8a_7duaporxL8TYXO4Q7ynCL_foKuwjGWIQRE5Q_GlOHUkTVclIx8hESsexXrENh8m_V8yzIAMUAUqoYmh_UR5L08WdyLpss-Pwh_MUiT-z_On--aA';    
        invalidToken = 'eyJhbGciOiJSUz';
        done();
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

    describe('Insert Salon Weekly Schedule', function(){
        var apiUrl = '/schedule/getsalondailyschedules';


        it('should return "InvalidTokenError" error trying to request with invalid token', function(done){

        });

    });
});