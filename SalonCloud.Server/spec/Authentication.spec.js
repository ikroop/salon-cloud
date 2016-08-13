﻿var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var configDB = require('./../config/dev/database.js');

describe('Routing', function () {
    var url = 'http://localhost:3000';
    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function (done) {
        // In our tests we use the test db
        mongoose.connect(configDB.url);
        done();
    });
    // use describe to give a title to your test suite, in this case the tile is "User"
    // and then specify a function in which we are going to declare all the tests
    // we want to run. Each test starts with the function it() and as a first argument 
    // we have to provide a meaningful title for it, whereas as the second argument we
    // specify a function that takes a single parameter, "done", that we will use 
    // to specify when our test is completed, and that's what makes easy
    // to perform async test!
    describe('User Register', function () {
        var apiUrl = /auth/register;

        it('should return "MissingUsername" error trying to register without username', function (done) {
            var user = {
                password: '123456'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    } 
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingUsername');
                    done();
                });
        });

        it('should return "NotEmailOrPhoneNumber" error trying to register with username is not email', function (done) {
            var user = {
                username: 'salonhelpstest',
                password: '123456'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('NotEmailOrPhoneNumber');
                    done();
                });
        });

        it('should return "NotEmailOrPhoneNumber" error trying to register with username is not phone number', function (done) {
            var user = {
                username: '12345678',
                password: '123456'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('NotEmailOrPhoneNumber');
                    done();
                });
        });

        it('should return "MissingPassword" error trying to register without password', function (done) {
            var user = {
                username: 'unittest@gmail.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingPassword');
                    done();
                });
        });

        it('should return "PasswordTooShort" error trying to register with password which length < 6', function (done) {
            var user = {
                username: 'unittest@gmail.com',
                password: '12345'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('PasswordTooShort');
                    done();
                });
        });

        it('should return "MissingFullName" error trying to register without full name', function (done) {
            var user = {
                username: 'unittest@gmail.com',
                password: '123456'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingFullName');
                    done();
                });
        });

        it('should return user object trying to register sucessfully', function (done) {
            var user = {
                username: 'unittest@gmail.com',
                password: '123456',
                fullname: 'salonhelps'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(200);
                    res.body.should.have.property('user');
                    res.body.err.should.have.property('username').eql(user.username);
                    done();
                });
        });        

        it('should return "UsernameAlreadyExists" trying to register with existing username', function (done) {
            var user = {
                username: 'unittest@gmail.com',
                password: '123456',
                fullname: 'salonhelps'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(409);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('UsernameAlreadyExists');
                    done();
                });
        });    
    });

    describe('User Login', function () {
        var apiUrl = /auth/login;

        it('should return "MissingUsername" error trying to login without username', function (done) {
            var user = {
                password: '123456'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingUsername');
                    done();
                });
        });         

        it('should return "MissingPassword" error trying to login without password', function (done) {
            var user = {
                username: 'test@salonhelps.com'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('MissingPassword');
                    done();
                });
        });

        it('should return "LoginFailed" error trying to login wrong password or username', function (done) {
            var user = {
                username: 'test@salonhelps.com',
                password: '123456'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('LoginFailed');
                    done();
                });
        });

        it('should return user object trying to login sucessfully', function (done) {
            var user = {
                username: 'unittest@gmail.com',
                password: '123456'
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(url)
                .post(apiUrl)
                .send(user)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(409);
                    res.body.should.have.property('user');
                    res.body.err.should.have.property('username').eql(user.username);
                    done();
                });
        });
    });
});