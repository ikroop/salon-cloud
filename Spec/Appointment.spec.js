/*var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');
var ErrorMessage = require('./../Core/ErrorMessage').ErrorMessage;

describe('Appointment Management', function () {
    var url = 'http://localhost:3000/api/v1';
    var validToken;
    var invalidToken;
    var validSalonId;
    var invalidSalonId;
    var notFoundSalonId;
    var defaultPassword = '1234@1234';
    var rightFormattedPhoneNumber = '9384484728';
    var wrongFormattedPhoneNumber = 'abd1234';
    var rightFormattedName = 'Tom Hanks';
    var emptyName = '   ';
    var tooLongName = 'Alibaba Nam Tren Ghe Sopha Mo Ve Noi Xa Xong Pha Tran Mac Cuop Duoc Dola Thiet Thiet La Nhieu Dola Xay Nha Cho Mafia'
    var existedServiceId = '';
    var notFoundServiceId = '';
    var invalidServiceId = '0000';
    var existedEmployeeId = '';
    var notFoundEmployeeId = '';
    var invalidEmployeeId = '1111';

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
                validSalonId = "57faa2692579df79216a153c";
                invalidSalonId = "00";
                notFoundSalonId = '97ba653d54a6e5';

                existedServiceId = '57fe92633674bf315450686d';
                notFoundServiceId = '00fe92633674bf315450686d';
                invalidServiceId = '000';

                existedEmployeeId = '';
                notFoundEmployeeId = '';
                invalidEmployeeId = '';

                done();
            });
    });

    describe('Unit Test Create Appointment By Phone', function () {
        var apiUrl = '/appointment/createbyphone';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to create appointment with invalid token', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': invalidToken })

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

        it('should return ' + ErrorMessage.MissingPhoneNumber.err.name + ' error trying to create appointment without customer\'s phone', function (done) {
            var bodyRequest = {
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

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

        it('should return ' + ErrorMessage.WrongPhoneNumberFormat.err.name + ' error trying to create appointment with wrong-formatted phone number', function (done) {
            var bodyRequest = {
                "customer_phone": wrongFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

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

        it('should return ' + ErrorMessage.MissingCustomerName.err.name + ' error trying to create appointment without customer\'s name', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingCustomerName.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to create appointment with customer\'s name = empty string', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": emptyName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

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

        it('should return ' + ErrorMessage.InvalidNameString.err.name + ' error trying to create appointment with too long customer\'s name', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": tooLongName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

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

        it('should return ' + ErrorMessage.MissingSalonId.err.name + ' error trying to create appointment without salonId', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

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

        it('should return ' + ErrorMessage.SalonNotFound.err.name + ' error trying to create appointment with wrong salonId', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": notFoundSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

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

        it('should return ' + ErrorMessage.MissingBookedServiceList.err.name + ' error trying to create appointment without service(s)', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingBookedServiceList.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingServiceId.err.name + ' error trying to create appointment which has service with no serviceId', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }, {
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingServiceId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.ServiceNotFound.err.name + ' error trying to create appointment which has not-found service', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }, {
                    service_id: notFoundServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.ServiceNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingEmployeeId.err.name + ' error trying to create appointment which has service with no employeeId', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId
                }, {
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingEmployeeId.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.EmployeeNotFound.err.name + ' error trying to create appointment which has not-found employee', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: notFoundEmployeeId
                }, {
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EmployeeNotFound.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingAppointmentTime.err.name + ' error trying to create appointment without booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingAppointmentTime.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingBookingTimeDay.err.name + ' error trying to create appointment which has no-day booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: notFoundEmployeeId
                }, {
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingBookingTimeDay.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingBookingTimeMonth.err.name + ' error trying to create appointment which has no-month booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: notFoundEmployeeId
                }, {
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingBookingTimeMonth.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingBookingTimeYear.err.name + ' error trying to create appointment which has no-year booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: notFoundEmployeeId
                }, {
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingBookingTimeYear.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingBookingTimeHour.err.name + ' error trying to create appointment which has no-hour booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: notFoundEmployeeId
                }, {
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingBookingTimeHour.err.name);
                    done();
                });
        });

        it('should return ' + ErrorMessage.MissingBookingTimeMinute.err.name + ' error trying to create appointment which has no-minute booking_time', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Appointment note",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: notFoundEmployeeId
                }, {
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2016,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.MissingBookingTimeMinute.err.name);
                    done();
                });
        });

        it('should return appointment_id if request proceeds successfully with note', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "note": "Any appointment note, even blank one, is acceptable",
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 28,
                    month: 2,
                    year: 2017,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    res.body.should.have.property('appointment_id');
                    done();
                });
        });

        it('should return appointment_id if request proceeds successfully without note', function (done) {
            var bodyRequest = {
                "customer_phone": rightFormattedPhoneNumber,
                "customer_name": rightFormattedName,
                "salon_id": validSalonId,
                "services": [{
                    service_id: existedServiceId,
                    employee_id: existedEmployeeId
                }],
                "booking_time": {
                    day: 27,
                    month: 2,
                    year: 2017,
                    hour: 10,
                    min: 45
                }
            };
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    res.body.should.have.property('appointment_id');
                    done();
                });
        });

    });
});*/