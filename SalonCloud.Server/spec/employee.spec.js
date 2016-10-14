var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');

describe('Employee Management', function () {
    var url = 'http://localhost:3000';
    var validToken;
    var invalidToken;
    var validSalonId;
    var invalidSalonId;
    var notFoundSalonId;
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

                validSalonId = res.body.user._id;//salon_id
                invalidSalonId = '00';
                notFoundSalonId = '97ba6280f531d1b53d54a6e5';
                done();
            });
    });

    describe('Unit Test Add New Employee', function () {
        var apiUrl = '/api/v1/employee/create';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to request with invalid token', function (done) {
            var token = invalidToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phonenumber': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to create new employee without salon id', function (done) {
            var token = validToken;
            var bodyRequest = {
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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

        it('should return ' + ErrorMessage.WrongIdFormat.err.name + ' error trying to create new employee wrong-format salon id', function (done) {
            var token = validToken;
            var salonId =invalidSalonId,
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to create new employee wrong salon id', function (done) {
            var token = validToken;
            var salonId =notFoundSalonId,
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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

        it('should return ' + ErrorMessage.MissingRole.err.name + ' error trying to create new employee without role', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'phonenumber': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingRole.err.name);
                    done();
                });
        }); 

        it('should return ' + ErrorMessage.MissingPhoneNumber.err.name + ' error trying to create new employee without phone number', function (done) {
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingPhoneNumber.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongPhoneNumberFormat.err.name + ' error trying to create new employee with wrong phone format', function (done) {
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongPhoneNumberFormat.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingFullName.err.name + ' error trying to create new employee without fullname', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingFullName.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to create new employee with fullname contains only blank space(s)', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': '   ',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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

        it('should return ' + ErrorMessage.MissingNickName.err.name + ' error trying to create new employee without nickname', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'salary_rate': 0.6,
                'cash_rate': 0.6,
                'social_security_number': '165374245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingNickName.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to create new employee with nickname contains only blank space(s)', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': '   ',
                'salary_rate': 0.6,
                'cash_rate': 0.6,
                'social_security_number': '165374245'
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

        it('should return ' + ErrorMessage.MissingSalaryRate.err.name + ' error trying to create new employee without nickname', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingSalaryRate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalaryRateRangeError.err.name + ' error trying to create new employee with salary_rate < 0', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': -1,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalaryRateRangeError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.SalaryRateRangeError.err.name + ' error trying to create new employee with salary_rate > 10', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 10.5,
                'cash_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.SalaryRateRangeError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingCashRate.err.name + ' error trying to create new employee without nickname', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'social_security_number': '165374245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingCashRate.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.CashRateRangeError.err.name + ' error trying to create new employee with cash_rate < 0', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': -0.5,
                'social_security_number': '165374245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.CashRateRangeError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.CashRateRangeError.err.name + ' error trying to create new employee with cash_rate > 10', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phone': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 11,
                'social_security_number': '165374245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.CashRateRangeError.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.WrongSSNFormat.err.name + ' error trying to create new employee with wrong-format SSN', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phonenumber': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '1653245'
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
                    res.body.err.should.have.property('name').eql(ErrorMessage.WrongSSNFormat.err.name);
                    done();
                });
        }); 

        it('should return employee object with id if new employee is added successfully without SSN', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phonenumber': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6
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

                    res.body.should.have.property('phone').eql(bodyRequest.phonenumber);
                    res.body.should.have.property('fullname').eql(bodyRequest.fullname);
                    res.body.should.have.property('role').eql(3);
                    done();
                });
        }); 

        it('should return employee object with id if new employee is added successfully with SSN', function (done) {
            var token = validToken;
            var salonId = validSalonId;
            var bodyRequest = {
                'salon_id': salonId,
                'role': 2,
                'phonenumber': '4049806189',
                'fullname': 'Thanh Le',
                'nickname': 'Lee',
                'salary_rate': 6,
                'cash_rate': 6,
                'social_security_number': '165374245'
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


                    res.body.should.have.property('phone').eql(bodyRequest.phonenumber);
                    res.body.should.have.property('fullname').eql(bodyRequest.fullname);
                    res.body.should.have.property('role').eql(3);
                    done();
                });
        }); 

    });
});