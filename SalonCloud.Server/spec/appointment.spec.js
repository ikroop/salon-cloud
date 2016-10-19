var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');
var ErrorMessage = require('./../core/ErrorMessage').ErrorMessage;

describe('Appointment Management', function () {
    let url = 'http://localhost:3000/api/v1';
    var validToken;
    var invalidToken;
    var validSalonId;
    var invalidSalonId;
    var notFoundSalonId;
    let defaultPassword = '1234@1234';
    let wrongFormattedPhoneNumber = '9384484728';
    let rightFormattedPhoneNumber = 'abd1234';
    let wrongFormattedName = 'Tom Hanks';
    let rightFormattedName = '   ';
    let existedServiceId = '';
    let notFoundServiceId = '';
    let invalidServiceId = '0000';
    let existedEmployeeId = '';
    let notFoundEmployeeId = '';
    let invalidEmployeeId = '1111';

    before(function (done) {

        // Login and get token
        var user = {
            username: 'unittest1473044833007@gmail.com',
            password: defaultPassword
        };
        request(url)
            .post('/authentication/signinwithusernameandpassword')
            .send(user)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                validToken = res.body.auth.token;
                invalidToken = 'eyJhbGciOiJSUz';
                validSalonId = "57faa2692579df79216a153c";
                invalidSalonId = "00";
                notFoundSalonId = '97ba653d54a6e5';
                done();
            });
    });

    describe('Unit Test Create Appointment By Phone', function () {
        var apiUrl = '/appointment/createbyphone';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
            var bodyRequest = { 
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services":[{
                            service_id: existedServiceId,
                            employee_id: existedEmployeeId
                            }],
                "booking_time": ""
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': invalidToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingPhoneNumber.err.name + ' error trying to create new employee without customer\'s phone', function (done) {
            var bodyRequest = { 
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services":[{
                            service_id: existedServiceId,
                            employee_id: existedEmployeeId
                            }],
                "booking_time": ""
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingPhoneNumber.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongPhoneNumberFormat.err.name + ' error trying to request with wrong-formatted phone number', function (done) {
            var bodyRequest = { 
                "customer_phone": wrongFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services":[{
                            service_id: existedServiceId,
                            employee_id: existedEmployeeId
                            }],
                "booking_time": ""
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongPhoneNumberFormat.err.name);
                    done();
                });
        });

    });
});