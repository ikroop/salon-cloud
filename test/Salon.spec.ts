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

describe('Salon Management', function () {
    let validToken;
    let invalidToken = 'eyJhbGciOiJSUz';
    let validSalonId;
    let invalidSalonId = "5825e0365193422";
    let notFoundSalonId = "5825e03651934227174513d8";
    let defaultPassword = '1234@1234';
    let validEmployeeId;
    let anotherUserId;
    let anotherUserToken;
    let validUserId;
    let invalidUserId = '100023232';
    let salonInformationInput: SalonInformation;

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
        validUserId = loginData.data.user._id;

        // 3. Create salon
        var signedInUser = new SignedInUser(loginData.data.user._id, new SalonManagement(null));
        salonInformationInput = {
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

    });

    describe('Unit Test Create Salon API', function () {
        var apiUrl = '/api/v1/salon/create';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to create salon information with invalid token', function (done) {
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

                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.InvalidTokenError.err.name);
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
                'salon_name': 'AtlantaNail',
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
                    res.body.should.have.property('_id');
                    done();
                });
        });

        it('should return salon object with id trying to create salon information successfully without email', function (done) {
            var token = validToken;
            var bodyRequest = {
                'salon_name': 'SunshineNails',
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
                    res.body.should.have.property('_id');
                    done();
                });
        });

    });

    describe('Unit Test Get Salon List By User Id', function () {
        var apiUrl = '/api/v1/salon/getsalonlist';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to get salon list with invalid token', function (done) {
            var token = invalidToken;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        })

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to get salon list without authentication', function (done) {
            var token = validToken;
            request(server)
                .post(apiUrl)

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.NoPermission.err.name);
                    done();
                });
        })

        it('should return salon information list trying to get salon list successfully', function (done) {
            var token = validToken;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    res.body.should.have.property('salon_list');
                    res.body.salon_list.should.have.length(2);
                    ['AtlantaNail', 'SunshineNails'].indexOf(res.body.salon_list[0].salon_name).should.not.be.equal(-1);
                    ['AtlantaNail', 'SunshineNails'].indexOf(res.body.salon_list[1].salon_name).should.not.be.equal(-1);
                    done();
                });
        })

    });

    describe('Unit Test Get Salon Information', function () {
        var apiUrl = '/api/v1/salon/getinformation';

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to get salon information without salon id', function (done) {
            var token = validToken;
            var url = apiUrl + '';
            request(server)
                .get(url)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingSalonId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get salon information with wrong salon id', function (done) {
            var token = validToken;
            var url = apiUrl + '?salon_id=123456789';
            request(server)
                .get(url)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return salon information trying to get salon information with valid salon id', function (done) {
            var token = validToken;
            var url = apiUrl + '?salon_id=' + validSalonId;
            request(server)
                .get(url)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    res.body.should.have.property('name');
                    res.body.name.should.be.equal(salonInformationInput.salon_name);
                    res.body.should.have.property('phone');
                    res.body.phone.should.be.equal(salonInformationInput.phone.number);
                    res.body.should.have.property('location');
                    res.body.location.should.be.equal(salonInformationInput.location.address);
                    res.body.should.have.property('email');
                    res.body.email.should.be.equal(salonInformationInput.email);
                    done();
                });
        });
    });
});