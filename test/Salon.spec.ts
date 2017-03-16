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
    let validUserIdOwner3Salons;
    let validTokenOwner3Salons;
    let invalidUserId = '100023232';
    let salonInformationInput_1: SalonInformation;

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
        validUserId = loginData.data.user._id;

        // 3. creat owner for 3 salons
        var authentication = new Authentication();
        const owner3Salonsmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
        await authentication.signUpWithUsernameAndPassword(owner3Salonsmail, defaultPassword);
        var loginOwner3SalonsData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(owner3Salonsmail, defaultPassword);
        validUserIdOwner3Salons = loginOwner3SalonsData.data.user._id;
        validTokenOwner3Salons = loginOwner3SalonsData.data.auth.token;

        // 3. Create salon
        var signedInUser = new SignedInUser(validUserIdOwner3Salons, new SalonManagement(null));
        salonInformationInput_1 = {
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
        var salon = await signedInUser.createSalon(salonInformationInput_1);
        validSalonId = salon.data.id;

        var salonInformationInput_2 = {
            email: 'salon2@salon.com',
            phone: {
                number: '7703456780',
                is_verified: false
            },
            location: {
                address: '22506 Bailey Dr NW, Norcross, GA 30071',
                is_verified: false,
                timezone_id: null
            },
            salon_name: 'Salon Appointment Test 2'
        }
        await signedInUser.createSalon(salonInformationInput_2);

        var salonInformationInput_3 = {
            email: 'salon3@salon.com',
            phone: {
                number: '7703456783',
                is_verified: false
            },
            location: {
                address: '32506 Bailey Dr NW, Norcross, GA 30071',
                is_verified: false,
                timezone_id: null
            },
            salon_name: 'Salon Appointment Test 32'
        }
        await signedInUser.createSalon(salonInformationInput_2);



    });

    describe('Unit Test Create Salon API', function () {
        var apiUrl = '/api/v1/salon/create';

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to create salon information with invalid token', function (done) {
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

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.Unauthorized.err.name);
                    res.body.error.code.should.be.equal(401);
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

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingSalonName.err.name);
                    res.body.error.code.should.be.equal(400);
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

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingAddress.err.name);
                    res.body.error.code.should.be.equal(400);
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

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingPhoneNumber.err.name);
                    res.body.error.code.should.be.equal(400);
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

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongPhoneNumberFormat.err.name);
                    res.body.error.code.should.be.equal(400);
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

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongEmailFormat.err.name);
                    res.body.error.code.should.be.equal(400);
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
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('id');

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
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('id');
                    done();
                });
        });

    });

    describe('Unit Test Get Salon List By User Id', function () {
        var apiUrl = '/api/v1/salon/getsalonlist';

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to get salon list with invalid token', function (done) {
            var token = invalidToken;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.Unauthorized.err.name);
                    res.body.error.code.should.be.equal(401);
                    done();
                });
        })

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to get salon list without authentication', function (done) {
            var token = validUserIdOwner3Salons;
            request(server)
                .get(apiUrl)

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.Unauthorized.err.name);
                    res.body.error.code.should.be.equal(401);
                    done();
                });
        })

        it('should return salon information list trying to get salon list successfully', function (done) {
            var token = validTokenOwner3Salons;
            request(server)
                .get(apiUrl)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('data');
                    res.body.data.should.have.length(3);
                    ['Salon Appointment Test', 'Salon Appointment Test 2', 'Salon Appointment Test 3'].indexOf(res.body.data[0].salon_name).should.not.be.equal(-1);
                    ['Salon Appointment Test', 'Salon Appointment Test 2', 'Salon Appointment Test 3'].indexOf(res.body.data[1].salon_name).should.not.be.equal(-1);
                    ['Salon Appointment Test', 'Salon Appointment Test 2', 'Salon Appointment Test 3'].indexOf(res.body.data[2].salon_name).should.not.be.equal(-1);

                    done();
                });
        })

    });

    describe('Unit Test Get Salon Information', function () {
        var apiUrl = '/api/v1/salon/getinformation';

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to get salon information without salon id', function (done) {
            var url = apiUrl + '';
            request(server)
                .get(url)
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to get salon information with wrong salon id', function (done) {
            var url = apiUrl + '?salon_id=123456789';
            request(server)
                .get(url)
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

        it('should return salon information trying to get salon information with valid salon id', function (done) {
            var url = apiUrl + '?salon_id=' + validSalonId;
            request(server)
                .get(url)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('name');
                    res.body.data.name.should.be.equal(salonInformationInput_1.salon_name);
                    res.body.data.should.have.property('phone');
                    res.body.data.phone.should.be.equal(salonInformationInput_1.phone.number);
                    res.body.data.should.have.property('location');
                    res.body.data.location.should.be.equal(salonInformationInput_1.location.address);
                    res.body.data.should.have.property('email');
                    res.body.data.email.should.be.equal(salonInformationInput_1.email);
                    done();
                });
        });
    });

    describe('Unit Test get salon settings', function () {
        var apiUrl = '/api/v1/salon/getsettings';

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId
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
                    res.body.error.name.should.be.equal(ErrorMessage.Unauthorized.err.name);
                    res.body.error.code.should.be.equal(401);
                    done();
                });
        });

        it('should return ' + ErrorMessage.Forbidden.err.name + ' error trying to request with token no permission', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId
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

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to create new employee without salon id', function (done) {
            var token = validToken;
            var bodyRequest = {

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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingSalonId.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to create new employee wrong salon id', function (done) {
            var token = validToken;
            var salonId = notFoundSalonId;
            var bodyRequest = {
                'salon_id': salonId
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
                    res.body.error.name.should.be.equal(ErrorMessage.SalonNotFound.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return salon settings data trying to get salon settings', function (done) {
            var token = validTokenOwner3Salons;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('appointment_reminder');
                    res.body.data.should.have.property('flexible_time');
                    res.body.data.should.have.property('technician_checkout');
                    res.body.data.should.have.property('enable_online_booking');
                    done();
                });
        });
    });

});