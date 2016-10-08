var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');

describe('Employee Management', function () {
    var url = 'http://localhost:3000';
    var validToken;
    var invalidToken;
    var defaultPassword = '1234@1234'

    before(function (done) {

        // Login and get token
        var user = {
            username: 'unittest1472245629435@gmail.com',
            password: defaultPassword
        };
        request(url)
            .post('/auth/signinwithemailandpassword')
            .send(user)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                validToken = res.body.auth.token;
                invalidToken = 'eyJhbGciOiJSUz';
                done();
            });
    });

    describe('Unit Test Add New Employee', function () {
        var apiUrl = '/api/v1/employee/create';

        it('should return "MissingPhoneNumber" error trying to create new employee without phone number', function (done) {
            var token = validToken;
            var bodyRequest = {
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 0.6,
                'cash_rate': 0.6
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingPhoneNumber');
                    done();
                });
        });

        it('should return "WrongPhoneNumberFormat" error trying to create new employee with wrong phone format', function (done) {
            var token = validToken;
            var bodyRequest = {
                'phone': 'abd1234',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 0.6,
                'cash_rate': 0.6
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('WrongPhoneNumberFormat');
                    done();
                });
        });

        it('should return "MissingFullName" error trying to create new employee without fullname', function (done) {
            var token = validToken;
            var bodyRequest = {
                'phone': '4049806189',
                'nickname': 'Lee',
                'salary_rate': 0.6,
                'cash_rate': 0.6
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingFullName');
                    done();
                });
        });

    });
});