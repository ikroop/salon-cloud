var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var configDB = require('./../config/dev/database.js');

describe('Salon', function () {
    var url = 'http://localhost:3000';
    var validToken;
    var invalidToken;
    var defaultPassword = '1234@1234'

    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function (done) {
        // In our tests we use the test db
        mongoose.connect(configDB.url);

        //get valid token
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
        validToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1N2JhMjYzZjFjMWQxNzBiMjJmZmRmZWUiLCJ1c2VybmFtZSI6InVuaXR0ZXN0MTQ3MTgxNzI3OTUyNUBnbWFpbC5jb20iLCJzdGF0dXMiOnRydWUsImlhdCI6MTQ3MTkyMjY3Nn0.M3C6rAF48NEeZ4fRdCKVysxfJyGuH_EbvE5_wwHxdPjQmq9dVb1XlX9KzB8oeTbzkcrpPha69IFcDZvA2tQ58KtwP8FcPi5mnEFF8Nrjujckt2kQUvLl8U9ko-sDhBMwnw0LmM7M8NRB87Ewz8tD9AwUrCFhGmXIoLvgVkY9hE_8QwKSu4ncM_qift7IuYkFh3QYNZ2TU3YCHdjzzlU5OMwqPV8bY2KCDm9bEHaeSSqIqa3x4_QAntSJk6AFjIyyfP19vBCnJ1P245ULGaEWF-tR0fPJFU7mF-bep2yDlMd8jNW_Fs3cFmK5q-f-MxaLqxcuD51Vbn9C9pL6xtXFrQ';    
        invalidToken = 'eyJhbGciOiJSUz';
        done();
    });

    describe('Create Salon Information', function () {
        var apiUrl = '/salon/createinformation';

        it('should return "InvalidTokenError" error trying to create salon information with invalid token', function (done) {
            var token = invalidToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '4049806189',
                'email': 'salon@salonhelps.com'
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

        it('should return "MissingSalonName" error trying to create salon information without salon name', function (done) {
            var token = validToken;
            var bodyRequest = {
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '4049806189',
                'email': 'salon@salonhelps.com'
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
                    res.body.err.should.have.property('name').eql('MissingSalonName');
                    done();
                });
        });

        it('should return "MissingAddress" error trying to create salon information without address', function (done) {
            var token = validToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'phonenumber': '4049806189',
                'email': 'salon@salonhelps.com'
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
                    res.body.err.should.have.property('name').eql('MissingAddress');
                    done();
                });
        });

        /*it('should return "WrongAddressFormat" error trying to create salon information with wrong address format', function (done) {
            var token = validToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW',
                'phonenumber': '4049806189',
                'email': 'salon@salonhelps.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set('Authorization', token)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    //res.body.should.have.property('err');
                    //res.body.err.should.have.property('name').eql('WrongAddressFormat');
                    done();
                });
        });*/

        it('should return "MissingPhoneNumber" error trying to create salon information without phone number', function (done) {
            var token = validToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'email': 'salon@salonhelps.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .set({ 'Authorization': token })
                .send(bodyRequest)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingPhoneNumber');
                    done();
                });
        });

        it('should return "WrongPhoneNumberFormat" error trying to create salon information with wrong phonenumber format', function (done) {
            var token = validToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '1234',
                'email': 'salon@salonhelps.com'
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
                    res.body.err.should.have.property('name').eql('WrongPhoneNumberFormat');
                    done();
                });
        });

        it('should return "WrongEmailFormat" error trying to create salon information with wrong email format', function (done) {
            var token = validToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '4049806189',
                'email': 'salon@salonhe'
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
                    res.body.err.should.have.property('name').eql('WrongEmailFormat');
                    done();
                });
        });

        it('should return salon object with id trying to create salon information successfully', function (done) {
            var token = validToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '4049806189',
                'email': 'salon@salonhelps.com'
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
                    res.body.should.have.property('_id');
                    done();
                });
        });

    });
});