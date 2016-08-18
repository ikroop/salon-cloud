var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var configDB = require('./../config/dev/database.js');

describe('User', function () {
    var url = 'http://localhost:3000';
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function (done) {
        // In our tests we use the test db
        mongoose.connect(configDB.url);
        done();
    });
    
    describe('Create Salon Information', function () {
        var apiUrl = '/salon/createinformation';

        it('should return "InvalidTokenError" error trying to create salon information with invalid token', function (done) {
            var token = '123456789';
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '4049806189',
                'email': 'salon@salonhelps.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set('Authorization', 'Bearer ' + token)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    } 
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidTokenError');
                    done();
                });
        });

        it('should return "InvalidTokenError" error trying to create salon information with invalid token', function (done) {
            var token = '123456789';
            var bodyRequest = {
                'salon_name': 'SunshineNails VA',
                'address': '2506 Bailey Dr NW, Norcross, GA 30071',
                'phonenumber': '4049806189',
                'email': 'salon@salonhelps.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set('Authorization', 'Bearer ' + token)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    } 
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidTokenError');
                    done();
                });
        });

        
    });
});