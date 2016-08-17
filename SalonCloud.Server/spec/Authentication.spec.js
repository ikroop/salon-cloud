var should = require('should');
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
    describe('User SignUp with Username & Password', function () {
        var apiUrl = '/auth/signupwithemailandpassword';

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

        it('should return "MissingFullname" error trying to register without full name', function (done) {
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
                    res.body.err.should.have.property('name').eql('MissingFullname');
                    done();
                });
        });

        it('should return user object trying to register sucessfully', function (done) {
            var user = {
                username: 'unittest3@gmail.com',
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
                    res.body.user.should.have.property('username').eql(user.username);
                    done();
                });
        });        

        it('should return "UserExistsError" trying to register with existing username', function (done) {
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
                    res.body.err.should.have.property('name').eql('UserExistsError');
                    done();
                });
        });    
    });

    describe('User Signin with Username & Password', function () {
        var apiUrl = '/auth/signinwithemailandpassword';

        it('should return "MissingUsername" error trying to Signin without username', function (done) {
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

        it('should return "MissingPassword" error trying to Signin without password', function (done) {
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

        it('should return "SignInFailed" error trying to Signin wrong password or username', function (done) {
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
                    res.body.err.should.have.property('name').eql('SignInFailed');
                    done();
                });
        });

        it('should return user & auth object trying to Signin sucessfully', function (done) {
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
                    res.body.user.should.have.property('username').eql(user.username);
                    res.body.should.have.property('auth');
                    res.body.auth.should.have.property('token');
                    done();
                });
        });
    });

    describe('Send password reset code to user by username(email or sms).', function (){
        var apiUrl = '/auth/sendpasswordreset';

        it('should return "MissingUsername" error trying to get password reset code without username', function (done) {
            var user = {
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

        it('should return "UserNotFound" error trying to get verification code with wrong-email-formatted username.', function (done) {
            var user = {
                username: 'unittest'
            };

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
                    res.body.err.should.have.property('name').eql('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to get verification code with wrong-phoneNo-formatted username.', function (done) {
            var user = {
                username: '123'
            };

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
                    res.body.err.should.have.property('name').eql('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to get verification code with not-found email user', function (done) {
            var user = {
                username: 'unittest@gmail.com'
            };

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
                    res.body.err.should.have.property('name').eql('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to get verification code with not-found phone user', function (done) {
            var user = {
                username: '0000000000'
            };

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
                    res.body.err.should.have.property('name').eql('UserNotFound');
                    done();
                });
        });

        it('should return "UserIsBlocked" error trying to get verification code with blocked email user', function (done) {
            var user = {
                username: 'samthui7@gmail.com'
            };

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
                    res.body.err.should.have.property('name').eql('UserIsBlocked');
                    done();
                });
        });

        it('should return "UserIsBlocked" error trying to get verification code with blocked phone user', function (done) {
            var user = {
                username: '1111111111'
            };

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
                    res.body.err.should.have.property('name').eql('UserIsBlocked');
                    done();
                });
        });

        it('should return code 200 if email user is valid to receive password reset code', function (done) {
            var user = {
                username: 'siamtian2015@gmail.com'
            };

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
                    !res.body.should.have.property('err');
                    done();
                });
        });

        it('should return code 200 if phone user is valid to receive password reset code', function (done) {
            var user = {
                username: '4049806189'
            };

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
                    !res.body.should.have.property('err');
                    done();
                });
        });
    });

    describe('Verify password reset code via email or sms.', function () {
        var apiUrl = '/auth/verifypasswordreset';

        it('should return "UserNotFound" error trying to verify with wrong-email-formatted username.', function (done) {
            var user = {
                username: 'unittest',
                password: 'ab',
                verify_code: '123'
            };

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
                    res.body.err.should.have.property('name').eql('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to verify  with wrong-phoneNo-formatted username.', function (done) {
            var user = {
                username: '123',
                password: 'ab',
                verify_code: '123'
            };

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
                    res.body.err.should.have.property('name').eql('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to verify with not-found email user', function (done) {
            var user = {
                username: 'unittest@gmail.com',
                password: 'ab',
                verify_code: '123'
            };

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
                    res.body.err.should.have.property('name').eql('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to verify with not-found phone user', function (done) {
            var user = {
                username: '0000000000',
                password: 'ab',
                verify_code: '123'
            };

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
                    res.body.err.should.have.property('name').eql('UserNotFound');
                    done();
                });
        });

        it('should return "UserIsBlocked" error trying to verify with blocked email user', function (done) {
            var user = {
                username: 'samthui7@gmail.com',
                password: 'ab',
                verify_code: '123'
            };

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
                    res.body.err.should.have.property('name').eql('UserIsBlocked');
                    done();
                });
        });

        it('should return "UserIsBlocked" error trying to verify with blocked phone user', function (done) {
            var user = {
                username: '1111111111',
                password: 'ab',
                verify_code: '123'
            };

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
                    res.body.err.should.have.property('name').eql('UserIsBlocked');
                    done();
                });
        });

        it('should return "MissingUsername" error trying to verify without username', function (done) {
            var user = {
                username: '',
                password: 'ab',
                verify_code: '123'
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

        it('should return "MissingPassword" error trying to verify code without password', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '',
                verify_code: '123'
            };

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

        it('should return "PasswordTooShort" error trying to verify code with short password.', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '1',
                verify_code: '123'
            };

            request(url)
                .post(apiUrl)
                .send(username)
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    // this is should.js syntax, very clear
                    res.status.should.be.equal(404);
                    res.body.should.have.property('err');
                    res.body.err.should.have.property('name').eql('PasswordTooShort');
                    done();
                });
        });

        it('should return "MissingVerifyCode" error trying to verify without code', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '1234567890',
                verify_code: ''
            };

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
                    res.body.err.should.have.property('name').eql('MissingVerifyCode');
                    done();
                });
        });

        it('should return "WrongVerifyCode" error trying to verify with wrong code', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '1234567890',
                verify_code: '000'
            };

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
                    res.body.err.should.have.property('name').eql('WrongVerifyCode');
                    done();
                });
        });

        it('should return code 200 if verification done for email user', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '1234567890',
                verify_code: '308372'
            };

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
                    !res.body.should.have.property('err');
                    done();
                });
        });

        it('should return code 200 if verification done for phone user', function (done) {
            var user = {
                username: '4049806189',
                password: '1234567890',
                verify_code: '308372'
            };

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
                    !res.body.should.have.property('err');
                    done();
                });
        });
    });
});