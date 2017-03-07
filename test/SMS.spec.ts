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
import * as moment from 'moment';

describe('SMS', function () {
    const phone: string = "4049806189";
    after(function (done) {
        server.close();
        done();
    });

    describe('Send Verification Code', function () {
        var apiUrl = '/api/v1/sms/sendverificationcode';
        it('should return ' + ErrorMessage.MissingPhoneNumber.err.name + ' error trying to send verification code without phone number', function (done) {
            var bodyRequest = {

            };
            request(server)
                .post(apiUrl)
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

        it('should return ' + ErrorMessage.WrongPhoneNumberFormat.err.name + ' error trying to send verification code with wrong phonenumber format', function (done) {
            var bodyRequest = {
                'phone': '1234'
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
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

        it('should return verification id trying to send verification code successfully', function (done) {
            var bodyRequest = {
                'phone': phone
            };
            request(server)
                .post(apiUrl)
                .send(bodyRequest)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    done();
                });
        });


    });
});