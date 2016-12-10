import * as server from '../src/App';
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
import { ByPhoneVerification } from './../src/Core/Verification/ByPhoneVerification';
import { EmployeeInput, EmployeeReturn } from './../src/Modules/UserManagement/EmployeeData';
import { UserToken } from './../src/Core/Authentication/AuthenticationData';
import { SalonCloudResponse } from './../src/Core/SalonCloudResponse';
import { SalonInformation } from './../src/Modules/SalonManagement/SalonData'
import * as moment from 'moment';

describe('Service Management', function () {
    let validToken;
    let invalidToken = 'eyJhbGciOiJSUz';
    let validSalonId;
    let invalidSalonId = "5825e0365193422";
    let notFoundSalonId = "5825e03651934227174513d8";
    let defaultPassword = '1234@1234';
    let validEmployeeId;
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
        var signedInUser = new SignedInUser(loginData.data.user._id, new SalonManagement(undefined));
        var salonInformationInput: SalonInformation = {
            email: 'salon@salon.com',
            phone: {
                number: '7703456789',
                is_verified: false
            },
            location: {
                address: '2506 Bailey Dr NW, Norcross, GA 30071',
                is_verified: false,
                timezone_id: undefined
            },
            salon_name: 'Salon Appointment Test'
        }
        var salon = await signedInUser.createSalon(salonInformationInput);

        validSalonId = salon.data;
        // 4. Add new employee
        const owner = new Owner(loginData.data.user._id, new SalonManagement(validSalonId));
        // Add new employee
        const employeeInput: EmployeeInput = {
            salon_id: validSalonId,
            role: 2,
            phone: "7703456789",
            fullname: "Jimmy Tran",
            nickname: "Jimmy",
            salary_rate: 0.6,
            cash_rate: 0.6
        };
        const employeeEmail = `${Math.random().toString(36).substring(7)}@gmail.com`;
        const employee: SalonCloudResponse<EmployeeReturn> = await owner.addEmployee(employeeEmail, employeeInput, new ByPhoneVerification());
        validEmployeeId = employee.data.uid;

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

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure'+(new Date().getTime().toString()),
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

                    res.status.should.be.equal(401);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.NoPermission.err.name + ' error trying to request with token no permission', function (done) {
            var token = anotherUserToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure'+(new Date().getTime().toString()),
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

                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.NoPermission.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingGroupName.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.InvalidNameString.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingDescription.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.InvalidDescriptionString.err.name);
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
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingSalonId.err.name);
                    done();
                });
        });

        /*it('should return ' + ErrorMessage.WrongIdFormat.err.name + ' error trying to add new service(s) with wrong-format salon id', function (done) {
            var token = validToken;
            var salonId = invalidSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure',
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.WrongIdFormat.err.name);
                    done();
                });
        });*/

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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.SalonNotFound.err.name);
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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingServiceName.err.name);

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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.InvalidNameString.err.name);

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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingServicePrice.err.name);

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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.ServicePriceRangeError.err.name);

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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.ServicePriceRangeError.err.name);

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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.MissingServiceTime.err.name);

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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.InvalidServiceTime.err.name);

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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.InvalidServiceTime.err.name);

                    done();
                });
        });

        it('should return id if request proceeds successfully without service_list', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure'+(new Date().getTime().toString()),
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
                    res.status.should.be.equal(200);

                    res.body.should.have.property('id');
                    // TODO: check uid format: Id must be a single String of 12 bytes or a string of 24 hex characters

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
                    res.status.should.be.equal(200);

                    res.body.should.have.property('id');
                    // TODO: check uid format: Id must be a single String of 12 bytes or a string of 24 hex characters
                    // let uid = res.body.property('uid');
                    // uid.should.be.
                    // let isHex: Boolean = res.body.property(uid).matches("[0-9A-F]+");//http://stackoverflow.com/questions/5317320/regex-to-check-string-contains-only-hex-characters
                    // let twelveBytes: Boolean = Buffer.byteLength(str, 'utf8');//http://stackoverflow.com/questions/9864662/how-to-get-the-string-length-in-bytes-in-nodejs

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

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.ServiceGroupNameExisted.err.name);
                    done();
                });
        });



    });
});