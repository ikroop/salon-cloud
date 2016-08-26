var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var configDB = require('./../config/dev/database.js');

describe('User', function () {
    var url = 'http://localhost:3000';
    var defaultPassword = '1234@1234'
    var validToken = null;
    var invalidToken = null;
    var salon_id = null;
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function (done) {
        var user = {
            username: 'unittest1471817279525@gmail.com',
            password: defaultPassword
        };
        // In our tests we use the test db
        mongoose.connect(configDB.url);
        request(url)
            .post('/auth/signinwithemailandpassword')
            .send(user)
            // end handles the response
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                validToken = res.body.auth.token;
                invalidToken = '1234455';
                salon_id = "57bc91c0862745040f89681a"; //(new Date().getTime()).toString();
                done();
            });
    });

    describe('Create Profile', function () {
        var apiUrl = '/user/createprofile';

        it('should return "InvalidTokenError" error trying to create profile with invalid token', function (done) {
            var token = invalidToken;
            var bodyRequest = {
                salon_id: salon_id,
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165374245',
                salary_rate: 6.5,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.err.should.have.property('name').eql('InvalidTokenError');
                    done();
                });
        });

        it('should return "MissingSalonId" Object error trying to create profile without salon_id', function (done) {
            var token = validToken;
            var bodyRequest = {
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165324565',
                salary_rate: 6.0,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.err.should.have.property('name').eql('MissingSalonId');
                    done();
                });
        });

        it('should return "WrongSalonIdFormat" Object error trying to create profile with wrong salon_id format', function (done) {
            var token = validToken;
            var bodyRequest = {
                salon_id: '57bdd3b',
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165324565',
                salary_rate: 6.0,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.err.should.have.property('name').eql('WrongIdFormat');
                    done();
                });
        });

        it('should return "SalonNotFound" Object error trying to create profile with wrong salon_id', function (done) {
            var token = validToken;
            var bodyRequest = {
                salon_id: '57bdd3bf48b0a7fc07478123',
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165324565',
                salary_rate: 6.0,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.err.should.have.property('name').eql('SalonNotFound');
                    done();
                });
        });

        it('should return "WrongSSNFormat" error trying to create profile with invalid SSN', function (done) {
            var token = validToken;
            var bodyRequest = {
                salon_id: salon_id,
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '1653245',
                salary_rate: 6.5,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.err.should.have.property('name').eql('WrongSSNFormat');
                    done();
                });
        });

        it('should return "SalaryRateRangeError" error trying to create profile with salary rate less than 0', function (done) {
            var token = validToken;
            var bodyRequest = {
                salon_id: salon_id,
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165324565',
                salary_rate: -1,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.err.should.have.property('name').eql('SalaryRateRangeError');
                    done();
                });
        });

        it('should return "SalaryRateRangeError" error trying to create profile with salary rate greater than 10', function (done) {
            var token = validToken;
            var bodyRequest = {
                salon_id: salon_id,
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165324565',
                salary_rate: 10.3,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.err.should.have.property('name').eql('SalaryRateRangeError');
                    done();
                });
        });

        it('should return "CashRateRangeError" error trying to create profile with cash rate less than 0', function (done) {
            var token = validToken;
            var bodyRequest = {
                salon_id: salon_id,
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165324565',
                salary_rate: 6,
                cash_rate: -3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.err.should.have.property('name').eql('CashRateRangeError');
                    done();
                });
        });

        it('should return "CashRateRangeError" error trying to create profile with cash rate greater than 10', function (done) {
            var token = validToken;
            var bodyRequest = {
                salon_id: salon_id,
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165324565',
                salary_rate: 6.0,
                cash_rate: 13.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.err.should.have.property('name').eql('CashRateRangeError');
                    done();
                });
        });

        it('should return User Object error trying to create profile successfully', function (done) {
            var token = validToken;
            var bodyRequest = {
                salon_id: salon_id,
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165324565',
                salary_rate: 6.0,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.body.should.have.property('profile');
                    var profile = res.body.profile[0];
                    profile.should.have.property('salon_id').eql(bodyRequest.salon_id);
                    done();
                });
        });

        it('should return "ProfileAlreadyExist" error trying to create profile with salon_id already exits', function (done) {
            var token = validToken;
            var bodyRequest = {
                salon_id: salon_id,
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165324565',
                salary_rate: 6.0,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
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
                    res.status.should.be.equal(409);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('ProfileAlreadyExist');
                    done();
                });
        });
    });
});