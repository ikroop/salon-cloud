import * as server from '../src/App';
import * as request from 'supertest';
import * as chai from 'chai';
var expect = chai.expect;
var should = chai.should();
import { ErrorMessage } from './../src/Core/ErrorMessage';

describe('Salon Management', function () {
    var validToken;
    var invalidToken;
    var defaultPassword = '1234@1234'

    before(function (done) {

        // Login and get token
        var user = {
            username: 'unittest1473044833007@gmail.com',
            password: defaultPassword
        };
        request(server)
            .post('/api/v1/authentication/signinwithusernameandpassword')
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

    after(function () {
    });

    describe('Unit Test Create Salon API', function () {
        var apiUrl = '/api/v1/salon/create';

        /*it('should return "InvalidTokenError" error trying to create salon information with invalid token', function (done) {
            var token = invalidToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '4049806189',
                'email': 'salon@salonhelps.com'
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('InvalidTokenError');
                    done();
                });
        });*/

        it('should return "MissingSalonName" error trying to create salon information without salon name', function (done) {
            var token = validToken;
            var bodyRequest = {
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '4049806189',
                'email': 'salon@salonhelps.com'
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('MissingSalonName');
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
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('MissingAddress');
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

            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set('Authorization', token)

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('WrongAddressFormat');
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
            request(server)
                .post(apiUrl)
                .set({ 'Authorization': token })
                .send(bodyRequest)

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('MissingPhoneNumber');
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
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('WrongPhoneNumberFormat');
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
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('WrongEmailFormat');
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
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('uid');
                    res.body.should.have.property('salon_id');
                    res.body.should.have.property('role').eql(1);
                    res.body.should.have.property('default_schedule');
                    res.body.should.have.property('sample_services');
                    res.body.should.have.property('salon_data');
                    done();
                });
        });

        it('should return salon object with id trying to create salon information successfully without email', function (done) {
            var token = validToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '4049806189'
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('uid');
                    res.body.should.have.property('salon_id');
                    res.body.should.have.property('role').eql(1);
                    res.body.should.have.property('default_schedule');
                    res.body.should.have.property('sample_services');
                    res.body.should.have.property('salon_data');
                    done();
                });
        });

    });
});