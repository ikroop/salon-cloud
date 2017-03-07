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
import { UserProfile } from './../src/Modules/UserManagement/UserData';
import { samplesService1, samplesService2 } from './../src/Core/DefaultData';

describe('Service Management', function () {
    let validToken;
    let invalidToken = 'eyJhbGciOiJSUz';
    let validSalonId;
    let invalidSalonId = "5825e0365193422";
    let notFoundSalonId = "5825e03651934227174513d8";
    let defaultPassword = '1234@1234';
    let anotherUserId;
    let anotherUserToken;
    const today: moment.Moment = moment();
    let startDateMoment = moment().add(1, 'months');
    let endDateMoment = moment().add(2, 'month');
    let totalDays = endDateMoment.diff(startDateMoment, 'days') + 1;
    let premadeGroupName = 'Successful Name' + (new Date().getTime().toString());

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

        // Create new user
        var authentication = new Authentication();
        const anotherEmail = `${Math.random().toString(36).substring(7)}@salonhelps.com`;
        await authentication.signUpWithUsernameAndPassword(anotherEmail, defaultPassword);
        // Get Token
        var loginData: SalonCloudResponse<UserToken> = await authentication.signInWithUsernameAndPassword(anotherEmail, defaultPassword);
        anotherUserId = loginData.data.user._id;
        anotherUserToken = loginData.data.auth.token;

    });

    describe('Unit Test Add Service', function () {
        var apiUrl = '/api/v1/service/create';

        it('should return ' + ErrorMessage.Unauthorized.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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

        it('should return ' + ErrorMessage.MissingGroupName.err.name + ' error trying to create new service(s) without specifying its group', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingGroupName.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to add new service(s) to group with invalid name', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': '   ',
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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

        it('should return ' + ErrorMessage.MissingDescription.err.name + ' error trying to create new service(s) without group-description', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingDescription.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDescriptionString.err.name + ' error trying to add new service(s) to group with invalid description', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': '     ',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidDescriptionString.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to add new service(s) without salon id', function (done) {
            var token = validToken;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to add new service(s) with wrong salon id', function (done) {
            var token = validToken;
            var salonId = notFoundSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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

        it('should return ' + ErrorMessage.MissingServiceName.err.name + ' error trying to add new service(s) without service_name', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'price': 5,
                        'time': 5
                    },
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingServiceName.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to add new service(s) with invalid service_name', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': '   ',
                        'price': 5,
                        'time': 5
                    },
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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

        it('should return ' + ErrorMessage.MissingServicePrice.err.name + ' error trying to add new service(s) without service_price', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 3600
                    },
                    {
                        'name': 'Traditional Pedicure 1',
                        'time': 3600
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingServicePrice.err.name);
                    res.body.error.code.should.be.equal(400);

                    done();
                });
        });

        it('should return ' + ErrorMessage.ServicePriceRangeError.err.name + ' error trying to add new service(s) service_price < $0', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 3600
                    },
                    {
                        'name': 'Traditional Pedicure 1',
                        'price': -5,
                        'time': 3600
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.ServicePriceRangeError.err.name);
                    res.body.error.code.should.be.equal(400);

                    done();
                });
        });

        it('should return ' + ErrorMessage.ServicePriceRangeError.err.name + ' error trying to add new service(s) service_price > $500', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 3600
                    },
                    {
                        'name': 'Traditional Pedicure 1',
                        'price': 501,
                        'time': 3600
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.ServicePriceRangeError.err.name);
                    res.body.error.code.should.be.equal(400);

                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingServiceTime.err.name + ' error trying to add new service(s) without service_time', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5
                    },
                    {
                        'name': 'Traditional Pedicure 1',
                        'price': 6,
                        'time': 5
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.MissingServiceTime.err.name);
                    res.body.error.code.should.be.equal(400);

                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidServiceTime.err.name + ' error trying to add new service(s) service_time < 5 minutes', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 180
                    },
                    {
                        'name': 'Traditional Pedicure 1',
                        'price': 6,
                        'time': 300
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidServiceTime.err.name);
                    res.body.error.code.should.be.equal(400);

                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidServiceTime.err.name + ' error trying to add new service(s) service_time > 3 hours', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 10801
                    },
                    {
                        'name': 'Traditional Pedicure 1',
                        'price': 6,
                        'time': 3600
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.InvalidServiceTime.err.name);
                    res.body.error.code.should.be.equal(400);

                    done();
                });
        });

        it('should return id if request proceeds successfully without service_list', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure' + (new Date().getTime().toString()),
                'description': 'Traditional Pedicure is a normal Pedicure.',
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
                    res.body.data.should.have.property('_id');

                    done();
                });
        });

        it('should return id if request proceeds successfully with valid service_list', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var groupName = premadeGroupName;
            var bodyRequest = {
                'group_name': groupName,
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 3',
                        'price': 9,
                        'time': 3600
                    },
                    {
                        'name': 'Traditional Pedicure 4',
                        'price': 15,
                        'time': 3600
                    }]
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
                    res.body.data.should.have.property('_id');
                    done();
                });
        });
        it('should return ' + ErrorMessage.ServiceGroupNameExisted.err.name + ' error trying to add new service(s) to group with existed name', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var groupName = premadeGroupName;
            var bodyRequest = {
                'group_name': groupName,
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId,
                'service_list': [
                    {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                    }]
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
                    res.body.error.name.should.be.equal(ErrorMessage.ServiceGroupNameExisted.err.name);
                    res.body.error.code.should.be.equal(400);
                    done();
                });
        });
    });

    describe('Unit Test Get Salon Services', function () {
        var apiUrl = '/api/v1/service/getall';

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

        it('should return salon services trying to get salon services with valid salon id', function (done) {
            var url = apiUrl + '?salon_id=' + validSalonId;
            request(server)
                .get(url)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('data');
                    res.body.data.length.should.be.equal(4);

                    done();
                });
        });
    });
});