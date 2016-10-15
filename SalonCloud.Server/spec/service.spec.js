var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');
var ErrorMessage = require('./../core/ErrorMessage').ErrorMessage;

describe('Service Management', function () {
    var url = 'http://localhost:3000/api/v1';
    var validToken;
    var invalidToken;
    var validSalonId;
    var invalidSalonId;
    var notFoundSalonId;
    var defaultPassword = '1234@1234'

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

                validSalonId = res.body.user._id;//salon_id
                invalidSalonId = '00';
                notFoundSalonId = '97ba6280f531d1b53d54a6e5';
                done();
            });
    });

    describe('Unit Test Add Service', function () {
        var apiUrl = '/service/create';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
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
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

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

        it('should return ' + ErrorMessage.MissingGroupName.err.name + ' error trying to create new service(s) without specifying its group', function (done) {
            var token = validToken;
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingGroupName.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to add new service(s) to group with invalid name', function (done) {
            var token = validToken;
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidNameString.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingDescription.err.name + ' error trying to create new service(s) without group-description', function (done) {
            var token = validToken;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure',
                'salon_id': salonId,
                'service_list': [
                     {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                     }]
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingDescription.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidDescriptionString.err.name + ' error trying to add new service(s) to group with invalid description', function (done) {
            var token = validToken;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure',
                'description': '     ',
                'salon_id': salonId,
                'service_list': [
                     {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                     }]
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidDescriptionString.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to add new service(s) without salon id', function (done) {
            var token = validToken;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure',
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'service_list': [
                     {
                        'name': 'Traditional Pedicure 0',
                        'price': 5,
                        'time': 5
                     }]
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingSalonId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongIdFormat.err.name + ' error trying to add new service(s) with wrong-format salon id', function (done) {
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongIdFormat.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to add new service(s) with wrong salon id', function (done) {
            var token = validToken;
            var salonId = notFoundSalonId;
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalonNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingServiceName.err.name + ' error trying to add new service(s) without service_name', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure',
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingServiceName.err.name);
                    
                    done();
                });
        });

        it('should return id if request proceeds successfully without service_list', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'group_name': 'Traditional Pedicure',
                'description': 'Traditional Pedicure is a normal Pedicure.',
                'salon_id': salonId
            };
            request(url)
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
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);

                    res.body.should.have.property('uid');
                    // TODO: check uid format: Id must be a single String of 12 bytes or a string of 24 hex characters
                    // let uid = res.body.property('uid');
                    // uid.should.be.
                    // let isHex: Boolean = res.body.property(uid).matches("[0-9A-F]+");//http://stackoverflow.com/questions/5317320/regex-to-check-string-contains-only-hex-characters
                    // let twelveBytes: Boolean = Buffer.byteLength(str, 'utf8');//http://stackoverflow.com/questions/9864662/how-to-get-the-string-length-in-bytes-in-nodejs

                    done();
                });
        });
    });
});