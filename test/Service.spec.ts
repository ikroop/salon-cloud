import * as server from '../src/App';
import * as request from 'supertest';
import * as chai from 'chai';
var expect = chai.expect;
var should = chai.should();
import { ErrorMessage } from './../src/Core/ErrorMessage';

describe('Service Management', function () {
    var validToken;
    var invalidToken;
    var validSalonId;
    var invalidSalonId;
    var notFoundSalonId;
    var premadeGroupName = 'Successful Name' + (new Date().getTime().toString());
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

                validSalonId = '57c0afac9265a426237f6f5f';//salon_id
                invalidSalonId = '00';
                notFoundSalonId = '97ba6280f531d1b53d54a6e5';
                done();
            });
    });

    after(function () {
    });

    describe('Unit Test Add Service', function () {
        var apiUrl = '/api/v1/service/create';

        /*it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
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

                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal(ErrorMessage.InvalidTokenError.err.name);
                    done();
                });
        });*/

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