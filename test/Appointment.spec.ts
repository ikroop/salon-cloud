import * as server from '../src/App';
import * as request from 'supertest';
import * as chai from 'chai';
var expect = chai.expect;
var should = chai.should();
import { ErrorMessage } from './../src/Core/ErrorMessage';

describe('Appointment Management', function () {
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
        request(server)
            .post('/api/v1/authentication/signinwithusernameandpassword')
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
        var apiUrl = '/api/v1/appointment/createbyphone';

        /* 1	Invalid token	403	
                error : 
                    - name: 'InvalidTokenError' 
                    - message: 'Token is invalid'
        */
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
            request(server)
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

        /* 2	Missing Phone Number	400	
                error : 
                    - name: 'MissingPhoneNumber' 
                    - message: 'Missing Phone Number'
        */
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
            request(server)
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

        /* 3	Wrong Phone Number Format	400	
                error : 
                    - name: 'WrongPhoneNumberFormat' 
                    - message: 'Wrong Phone Number Format'
        */
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
            request(server)
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

        /* 4	Missing Customer Name	400	
                error : 
                    - name: 'MissingCustomerName' 
                    - message: 'Missing Customer Name' 
        */
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
            request(server)
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

        /* 5	Invalid Name String (name is empty)	400	
                error : 
                    - name: 'InvalidNameString' 
                    - message: 'Invalid Name String (Name is empty)'
        */
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
            request(server)
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

        /* 6	Invalid Name String (name is too long)	400	
                error : 
                    - name: 'InvalidNameString' 
                    - message: 'Invalid Name String (Name is too long)'
        */
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
            request(server)
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

        /* 7	Missing SalonID	400	
                error : 
                    - name: 'MissingSalonID' 
                    - message: 'Missing SalonID'
        */
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
            request(server)
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

        /* 8	Salon Not Found	400
                error : 
                    - name: 'SalonNotFound' 
                    - message: 'Salon Not Found'
        */
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
            request(server)
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

        /* 9	Missing Booked Service List	400	
                error : 
                    - name: 'MissingBookedServiceList' 
                    - message: 'Missing Booked Service List'
        */
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
            request(server)
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

        /* 10	Missing Service Id	400	
                error : 
                    - name: 'MissingServiceId' 
                    - message: 'Missing Service Id'
        */
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
            request(server)
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

        /* 11	Service Not Found	400	
                error : 
                    - name: 'ServiceNotFound' 
                    - message: 'Service Not Found'
        */
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
            request(server)
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

        /* 12	Missing Employee Id	400	
                error : 
                    - name: 'MissingEmployeeId' 
                    - message: 'Missing Employee Id'
        */
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
            request(server)
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

        /* 13	Employee Not Found	400	
                error : 
                    - name: 'EmployeeNotFound' 
                    - message: 'Employee Not Found'
        */
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
            request(server)
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

        /* 14	Missing Appointment Time	400	
                error : 
                    - name: 'MissingAppointmentTime' 
                    - message: 'Missing Appointment Time'
        */
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
            request(server)
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
            request(server)
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
            request(server)
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
            request(server)
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
            request(server)
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
            request(server)
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

        /* 15	AppointmentTime.Start < SalonDailySchedule.Open	400	
                error : 
                    - name: 'EarlierAppointmentTimeThanSalonTimeOnCertainDate' 
                    - message: 'Appointment's start time is earlier than salon's open time on appointment date on that date'
        */
        it('should return ' + ErrorMessage.EarlierAppointmentTimeThanSalonTimeOnCertainDate.err.name + ' error trying to create appointment which has early booking_time', function (done) {
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
                    hour: 5,
                    min: 15
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.EarlierAppointmentTimeThanSalonTimeOnCertainDate.err.name);
                    done();
                });
        });

        /* 16	AppointmentTime.Start > SalonDailySchedule.Close	400	
                error : 
                    - name: 'LaterAppointmentTimeThanSalonTimeOnCertainDate' 
                    - message: 'Appointment's start time is later than salon's open time on appointment date on that date'
        */
        it('should return ' + ErrorMessage.LaterAppointmentTimeThanSalonTimeOnCertainDate.err.name + ' error trying to create appointment which has late booking_time', function (done) {
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
                    hour: 23,
                    min: 15
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.LaterAppointmentTimeThanSalonTimeOnCertainDate.err.name);
                    done();
                });
        });

        /* 17	AppointmentTime.End > SalonDailySchedule.Close	400	
                error : 
                    - name: 'AppointmentCanNotBeDoneWithinSalonWorkingTime' 
                    - message: 'Appointment cannot be done within salon's working time'
        */
        it('should return ' + ErrorMessage.AppointmentCanNotBeDoneWithinSalonWorkingTime.err.name + ' error trying to create appointment which cannot be done within salon\'s working time', function (done) {
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
                    hour: 20,
                    min: 55
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.AppointmentCanNotBeDoneWithinSalonWorkingTime.err.name);
                    done();
                });
        });

        /* 18	currentAppointment.Start < anotherAppointment.End 	400	
                error : 
                    - name: 'OverlapAnotherAppointmentEndTime' 
                    - message: 'There is an un-finished appointment at appointment's start time!'
        */
        it('should return ' + ErrorMessage.OverlapAnotherAppointmentEndTime.err.name + ' error trying to create appointment which has start time overlaps another appointment\'s end time', function (done) {
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
                    hour: 20,
                    min: 55
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.OverlapAnotherAppointmentEndTime.err.name);
                    done();
                });
        });

        /* 19	currentAppointment.End > (anotherAppointment.Start + delay)	400	
                error : 
                    - name: 'OverlapAnotherAppointmentStartTime' 
                    - message: 'There's an appointment that starts before this appointment ends!'
        */
        it('should return ' + ErrorMessage.OverlapAnotherAppointmentStartTime.err.name + ' error trying to create appointment which has end time overlaps another appointment\'s start time', function (done) {
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
                    hour: 20,
                    min: 55
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.OverlapAnotherAppointmentStartTime.err.name);
                    done();
                });
        });

        /* 20	currentAppointment.Start < (anotherAppointment.End + delay) 	400	
                error : 
                    - name: 'OverlapDelayedAppointmentEndTime' 
                    - message: 'Appointment's start time may not be available since previous appointment may be delayed!'
        */
        it('should return ' + ErrorMessage.OverlapDelayedAppointmentEndTime.err.name + ' error trying to create appointment which has start time may not be available since previous appointment may be delayed', function (done) {
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
                    hour: 20,
                    min: 55
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.OverlapDelayedAppointmentEndTime.err.name);
                    done();
                });
        });

        /* 21	currentAppointment.End > fix anotherAppointment.Start	400	
                error : 
                    - name: 'OverlapAnotherAppointmentStartTimeFixed' 
                    - message: 'Appointment's end time is not available since next appointment cannot be more delayed!'
        */
        it('should return ' + ErrorMessage.OverlapAnotherAppointmentStartTimeFixed.err.name + ' error trying to create appointment which has end time may not available since next appointment cannot be more delayed', function (done) {
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
                    hour: 20,
                    min: 55
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.OverlapAnotherAppointmentStartTimeFixed.err.name);
                    done();
                });
        });

        /* 22	(currentAppointment.Start > anotherAppointment.Start) && (currentAppointment.End < anotherAppointment.End)	
                400	
                error : 
                    - name: 'AppointmentTimeNotAvailable' 
                    - message: 'Appointment time is not available!'
        */
        it('should return ' + ErrorMessage.AppointmentTimeNotAvailable.err.name + ' error trying to create appointment which has unavailable appointment_time', function (done) {
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
                    hour: 20,
                    min: 55
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.AppointmentTimeNotAvailable.err.name);
                    done();
                });
        });

        /* 23	(anotherAppointment.Start > currentAppointment.Start) && (anotherAppointment.End < currentAppointment.End)	
                400	
                error : 
                    - name: 'CompletelyOverlapAnotherAppointment' 
                    - message: 'Another appointment has already been at that time!'
        */
        it('should return ' + ErrorMessage.CompletelyOverlapAnotherAppointment.err.name + ' error trying to create appointment which completely overlaps another appointment', function (done) {
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
                    hour: 20,
                    min: 55
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.CompletelyOverlapAnotherAppointment.err.name);
                    done();
                });
        });

        /* 24	NotEnoughTimeForAppointment	
                400	
                error : 
                    - name: 'NotEnoughTimeForAppointment' 
                    - message: 'This appointment may not have enough time because of its previous & next appointments!'
        */
        it('should return ' + ErrorMessage.NotEnoughTimeForAppointment.err.name + ' error trying to create appointment which may have not enough time', function (done) {
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
                    hour: 20,
                    min: 55
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.NotEnoughTimeForAppointment.err.name);
                    done();
                });
        });

        /* 25	InvalidAppointmentStartTime	
                400	
                error : 
                    - name: 'InvalidAppointmentStartTime' 
                    - message: 'This appointment has start time which is in the past!'
        */
        it('should return ' + ErrorMessage.InvalidAppointmentStartTime.err.name + ' error trying to create appointment which has start time in the past', function (done) {
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
                    hour: 20,
                    min: 55
                }
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': validToken })

                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql(ErrorMessage.InvalidAppointmentStartTime.err.name);
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
            request(server)
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
            request(server)
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
});