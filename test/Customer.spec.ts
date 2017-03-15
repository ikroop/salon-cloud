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
import { SalonCloudResponse } from './../src/Core/SalonCloudResponse';
import { UserToken } from './../src/Core/Authentication/AuthenticationData';
import { PhoneVerification } from './../src/Core/Verification/PhoneVerification';
import { IVerificationData } from './../src/Core/Verification/VerificationData';
import { SalonInformation } from './../src/Modules/SalonManagement/SalonData';
import { SignedInUser } from './../src/Core/User/SignedInUser';
import { SalonManagement } from './../src/Modules/SalonManagement/SalonManagement';

describe('Customer Test cases', function () {
    var defaultPassword = '1234@1234'
    var validToken;
    var invalidToken = '12dfab3bc554ad';
    var username = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
    var invalidPassword = "123456";
    var phoneNumber = ((new Date()).getTime() % 10000000000).toString();
    var invalidPhoneNumber = "333";
    var verificationObject: IVerificationData = null;
    var invalidCode = "213123";
    var wrongCode: string = null;
    var invalidVerificationId = "3324234";
    var validSalonId: string = null;
    var invalidSalonId: string = "123123";

    beforeEach(function (done) {
        setTimeout(function () {
            done();
        }, 500);
    });

    before(async function () {
        // 1. Create Owner 
        var authentication = new Authentication();
        const ownerEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
        await authentication.signUpWithUsernameAndPassword(ownerEmail, defaultPassword);

        const AnotherWwnerEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
        await authentication.signUpWithUsernameAndPassword(AnotherWwnerEmail, defaultPassword);
        // 2. login to get access token
        var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(ownerEmail, defaultPassword);
        validToken = loginData.data.auth.token;

        // 3. send verification code for customer signup
        var phoneVerification = new PhoneVerification();
        var sendVerificationResult = await phoneVerification.sendVerificationCode(phoneNumber);
        if (sendVerificationResult.err) {
            console.error('Error:', sendVerificationResult.err);
        } else {
            verificationObject = sendVerificationResult.data;
            wrongCode = (String)((Number)(verificationObject.code) + 1);
        }

        // 4. Create salon
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
    });

    describe('Customer Signup', function () {
        var apiUrl = '/api/v1/customer/create';

        it('should return ' + ErrorMessage.MissingPhoneNumber.err.name + ' trying to sign up customer without phonenumber', function (done) {
            var user = {
                code: verificationObject.code,
                verification_id: verificationObject._id,
                salon_id: validSalonId,
                fullname: "Marisol"
            };
            request(server)
                .post(apiUrl)
                .send(user)
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

        it('should return ' + ErrorMessage.WrongPhoneNumberFormat.err.name + ' trying to sign up customer without invalid phonenumber', function (done) {
            var user = {
                phone: invalidPhoneNumber,
                code: verificationObject.code,
                verification_id: verificationObject._id,
                salon_id: validSalonId,
                fullname: "Marisol"
            };
            request(server)
                .post(apiUrl)
                .send(user)
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

        it('should return ' + ErrorMessage.MissingVerificationId.err.name + ' trying to sign up customer without verification Id', function (done) {
            var user = {
                phone: phoneNumber,
                code: verificationObject.code,
                salon_id: validSalonId,
                fullname: "Marisol"
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingVerificationId.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingVerificationCode.err.name + ' trying to sign up customer without verification code', function (done) {
            var user = {
                phone: phoneNumber,
                verification_id: verificationObject._id,
                salon_id: validSalonId,
                fullname: "Marisol"
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingVerificationCode.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongVerificationCode.err.name + ' trying to sign up customer with wrong verification code', function (done) {
            var user = {
                phone: phoneNumber,
                code: wrongCode,
                verification_id: verificationObject._id,
                salon_id: validSalonId,
                fullname: "Marisol"
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.WrongVerificationCode.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' trying to sign up customer without salon id', function (done) {
            var user = {
                phone: phoneNumber,
                verification_id: verificationObject._id,
                code: verificationObject.code,
                fullname: "Marisol"
            };
            request(server)
                .post(apiUrl)
                .send(user)
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

        it('should return ' + ErrorMessage.MissingCustomerName.err.name + ' trying to sign up customer without fullname', function (done) {
            var user = {
                phone: phoneNumber,
                verification_id: verificationObject._id,
                code: verificationObject.code,
                salon_id: validSalonId

            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('error');
                    res.body.error.name.should.be.equal(ErrorMessage.MissingCustomerName.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return phonenumber & password trying to signup sucessfully', function (done) {
            var user = {
                phone: phoneNumber,
                code: verificationObject.code,
                verification_id: verificationObject._id,
                salon_id: validSalonId,
                fullname: "Marisol"
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('data');
                    done();
                });
        });

    });
});