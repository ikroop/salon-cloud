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
import { Authentication } from './../src/Core/Authentication/Authentication';
import { SignedInUser } from './../src/Core/User/SignedInUser';
import { Owner } from './../src/Core/User/Owner';
import { SalonManagement } from './../src/Modules/SalonManagement/SalonManagement';
import { PhoneVerification } from './../src/Core/Verification/PhoneVerification';
import { EmployeeReturn } from './../src/Modules/UserManagement/EmployeeData';
import { UserToken } from './../src/Core/Authentication/AuthenticationData';
import { SalonCloudResponse } from './../src/Core/SalonCloudResponse';
import { SalonInformation } from './../src/Modules/SalonManagement/SalonData'

describe('Employee Management', function () {
    let validToken;
    let invalidToken = 'eyJhbGciOiJSUz';
    let validSalonId;
    let invalidSalonId = "5825e0365193422";
    let notFoundSalonId = "5825e03651934227174513d8";
    let defaultPassword = '1234@1234';
    let validEmployeeId;
    let anotherUserId;
    let anotherUserToken;

    before(async function () {
        // 1. Create Owner 
        var authentication = new Authentication();
        const ownerEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
        await authentication.signUpWithUsernameAndPassword(ownerEmail, defaultPassword);

        // 2. login to get access token
        var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(ownerEmail, defaultPassword);
        validToken = loginData.data.auth.token;
        // 3. Create salon
        var signedInUser = new SignedInUser(loginData.data.user._id, new SalonManagement(null));
        var salonInformationInput: SalonInformation = {
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
        validSalonId = salon.data.id;

        var authentication = new Authentication();
        const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
        await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
        // Get Token
        var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
        anotherUserId = loginData.data.user._id;
        anotherUserToken = loginData.data.auth.token;

    });

    describe('Unit Test Add New Employee', function () {
        var apiUrl = '/api/v1/employee/create';

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
            var token = anotherUserToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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

        it('should return ' + ErrorMessage.MissingRole.err.name + ' error trying to create new employee without role', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingRole.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.RoleRangeError.err.name + ' error trying to create new employee with role <= 0', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 0,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.RoleRangeError.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.RoleRangeError.err.name + ' error trying to create new employee with role >= 5', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 5,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.RoleRangeError.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.UnacceptedRoleForAddedEmployeeError.err.name + ' error trying to create new employee with role = 1', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 1,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.UnacceptedRoleForAddedEmployeeError.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.UnacceptedRoleForAddedEmployeeError.err.name + ' error trying to create new employee with role = 4', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 4,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.UnacceptedRoleForAddedEmployeeError.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingUsername.err.name + ' error trying to create new employee without phone number', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingUsername.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NotEmailOrPhoneNumber.err.name + ' error trying to create new employee with wrong phone format', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': 'abd1234',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.NotEmailOrPhoneNumber.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingFullName.err.name + ' error trying to create new employee without fullname', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingFullName.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to create new employee with fullname contains only blank space(s)', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': '   ',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidNameString.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingNickName.err.name + ' error trying to create new employee without nickname', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'salary_rate': 0.6,
                'cash_rate': 0.6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingNickName.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to create new employee with nickname contains only blank space(s)', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': '   ',
                'salary_rate': 0.6,
                'cash_rate': 0.6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidNameString.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingSalaryRate.err.name + ' error trying to create new employee without nickname', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingSalaryRate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalaryRateRangeError.err.name + ' error trying to create new employee with salary_rate < 0', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': -1,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.SalaryRateRangeError.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalaryRateRangeError.err.name + ' error trying to create new employee with salary_rate > 10', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 10.5,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.SalaryRateRangeError.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingCashRate.err.name + ' error trying to create new employee without nickname', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingCashRate.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.CashRateRangeError.err.name + ' error trying to create new employee with cash_rate < 0', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': -0.5,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.CashRateRangeError.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.CashRateRangeError.err.name + ' error trying to create new employee with cash_rate > 10', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 11,
                'social_security_number': '165374245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.CashRateRangeError.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongSSNFormat.err.name + ' error trying to create new employee with wrong-format SSN', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '1653245'
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
                    res.body.error.name.should.be.equal(ErrorMessage.WrongSSNFormat.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return employee object with id if new employee is added successfully without SSN', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6
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
                    res.body.data.should.have.property('uid');
                    res.body.data.should.have.property('salon_id');
                    res.body.data.salon_id.should.be.equal(salonId);
                    done();
                });
        });

        it('should return employee object with id if new employee is added successfully with SSN', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': ((new Date()).getTime() % 10000000000).toString(),
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.data.should.have.property('uid');
                    res.body.data.should.have.property('salon_id');
                    res.body.data.salon_id.should.be.equal(salonId);
                    done();
                });
        });

    });

    //Add unit test for get employee list by salon id
    describe('Unit Test Get Employee List', function () {
        var apiUrl = '/api/v1/employee/getall';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with missing token', function (done) {
            var parameterUrl = apiUrl + '?salon_id=' + validSalonId;
            request(server)
                .get(parameterUrl)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
            var parameterUrl = apiUrl + '?salon_id=' + validSalonId;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': invalidToken })
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

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to request with token no permission', function (done) {
            var parameterUrl = apiUrl + '?salon_id=' + validSalonId;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': anotherUserToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.NoPermission.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to request without salon id', function (done) {
            var parameterUrl = apiUrl;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to request with wrong salon id', function (done) {
            var parameterUrl = apiUrl + '?salon_id=' + invalidSalonId;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
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

        it('should return all employee list by salon id successfully', function (done) {
            var parameterUrl = apiUrl + '?salon_id=' + validSalonId;
            request(server)
                .get(parameterUrl)
                .set({ 'Authorization': validToken })
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('employees');
                    done();
                });
        });
    });
});