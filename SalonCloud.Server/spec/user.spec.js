var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var configDB = require('./../config/dev/database.js');

describe('User', function () {
    var url = 'http://localhost:3000';
    var defaultPassword = '1234@1234'
    var validToken = null;
    var invalidToken = null;
    var salon_id = null;
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function (done) {
        var user = {
            username: 'unittest1471817279525@gmail.com',
            password: defaultPassword
        };
        // In our tests we use the test db
        mongoose.connect(configDB.url);
        request(url)
            .post('/auth/signinwithemailandpassword')
            .send(user)
            // end handles the response
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                validToken = res.body.auth.token;
                invalidToken = '1234455';
                salon_id = '57bb3102b70ec33116d8499e';
                done();
            });
    });

    describe('Create Profile', function () {
        var apiUrl = '/user/createprofile';

        it('should return "InvalidTokenError" error trying to create profile with invalid token', function (done) {
            var token = invalidToken;
            var bodyRequest = {
                "salon_id": salon_id,
                status: true,
                role: 3,
                fullname: 'Jelly Gaskill',
                nickname: 'Jelly',
                social_security_number: '165374245',
                salary_rate: 6.5,
                cash_rate: 3.5,
                birthday: 'May, 05',
                address: '2506 Bailey Dr, Norcross, GA 30071',
                email: 'legacynails@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(bodyRequest)
                .set({ 'Authorization': token })
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('InvalidTokenError');
                    done();
                });
        });
    });
});