/**
 * 
 * 
 * 
 */
import * as server from '../src/App';
import * as request from 'supertest';
import * as chai from 'chai';
var expect = chai.expect;
var should = chai.should();

describe('Authentication', function () {
    var timestamp = new Date().getTime();
    var defaultPassword = '1234@1234'
    /*before(function (done) {
        delete require.cache[require.resolve('./../src/App')];
        server = require('./../src/App');
        done();
    });
    after(function () {
        server.close();
    });*/

    beforeEach(function () {
    });
    afterEach(function () {
    });

    describe('User SignUp with Username & Password', function () {
        var apiUrl = '/api/v1/authentication/signupwithusernameandpassword';

        it('should return "MissingUsername" error trying to register without username', function (done) {
            var user = {
                password: defaultPassword
            };
            request(server)
                .post('/api/v1/authentication/signupwithusernameandpassword')
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('MissingUsername');
                    done();
                });
        });

        it('should return "NotEmailOrPhoneNumber" error trying to register with username is not email', function (done) {
            var user = {
                username: 'salonhelpstest',
                password: defaultPassword
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('NotEmailOrPhoneNumber');
                    done();
                });
        });

        it('should return "NotEmailOrPhoneNumber" error trying to register with username is not phone number', function (done) {
            var user = {
                username: '12345678',
                password: defaultPassword
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('NotEmailOrPhoneNumber');
                    done();
                });
        });

        it('should return "MissingPassword" error trying to register without password', function (done) {
            var user = {
                username: 'unittest@gmail.com'
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('MissingPassword');
                    done();
                });
        });

        it('should return "PasswordTooShort" error trying to register with password which length < 6', function (done) {
            var user = {
                username: 'unittest@gmail.com',
                password: '12345'
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('PasswordTooShort');
                    done();
                });
        });

        it('should return user object trying to register sucessfully', function (done) {
            var user = {
                username: 'unittest' + timestamp + '@gmail.com',
                password: defaultPassword
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    done();
                });
        });

        it('should return "UserExistsError" trying to register with existing username', function (done) {
            var user = {
                username: 'unittest' + timestamp + '@gmail.com',
                password: defaultPassword,
                fullname: 'salonhelps'
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(409);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('UserExistsError');
                    done();
                });
        });
    });

    describe('User Signin with Username & Password', function () {
        var apiUrl = '/api/v1/Authentication/signinwithusernameandpassword';

        it('should return "MissingUsername" error trying to Signin without username', function (done) {
            var user = {
                password: defaultPassword
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('MissingUsername');
                    done();
                });
        });

        it('should return "MissingPassword" error trying to Signin without password', function (done) {
            var user = {
                username: 'test@salonhelps.com'
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(400);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('MissingPassword');
                    done();
                });
        });

        it('should return "SignInFailed" error trying to Signin wrong password or username', function (done) {
            var user = {
                username: 'test@salonhelps.com',
                password: defaultPassword
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(403);
                    res.body.should.have.property('err');
                    res.body.err.name.should.be.equal('SignInFailed');
                    done();
                });
        });

        it('should return user & auth object trying to Signin sucessfully', function (done) {
            var user = {
                username: 'unittest' + timestamp + '@gmail.com',
                password: defaultPassword
            };
            request(server)
                .post(apiUrl)
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.status.should.be.equal(200);
                    res.body.should.have.property('user');
                    res.body.user.username.should.be.equal(user.username);
                    res.body.should.have.property('auth');
                    res.body.auth.should.have.property('token');
                    done();
                });
        });
    });

    /*describe('Send password reset code to user by username(email or sms).', function () {
        var apiUrl = '/auth/sendpasswordreset';

        it('should return "MissingUsername" error trying to get password reset code without username', function (done) {
            var user = {
            };
            // once we have specified the info we want to send to the server via POST verb,
            // we need to actually perform the action on the resource, in this case we want to 
            // POST on /api/auth/register and we want to send some info
            // We do this using the request object, requiring supertest!
            request(server)
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
                    res.body.err.name.should.be.equal('MissingUsername');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to get verification code with wrong-email-formatted username.', function (done) {
            var user = {
                username: 'unittest'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to get verification code with wrong-phoneNo-formatted username.', function (done) {
            var user = {
                username: '123'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to get verification code with not-found email user', function (done) {
            var user = {
                username: 'unittest@gmail.com'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to get verification code with not-found phone user', function (done) {
            var user = {
                username: '0000000000'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserNotFound');
                    done();
                });
        });

        it('should return "UserIsBlocked" error trying to get verification code with blocked email user', function (done) {
            var user = {
                username: 'samthui7@gmail.com'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserIsBlocked');
                    done();
                });
        });

        it('should return "UserIsBlocked" error trying to get verification code with blocked phone user', function (done) {
            var user = {
                username: '1111111111'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserIsBlocked');
                    done();
                });
        });

        it('should return code 200 if email user is valid to receive password reset code', function (done) {
            var user = {
                username: 'siamtian2015@gmail.com'
            };

            request(server)
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

            request(server)
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

            request(server)
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
                    res.body.err.name.should.be.equal('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to verify  with wrong-phoneNo-formatted username.', function (done) {
            var user = {
                username: '123',
                password: 'ab',
                verify_code: '123'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to verify with not-found email user', function (done) {
            var user = {
                username: 'unittest@gmail.com',
                password: 'ab',
                verify_code: '123'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserNotFound');
                    done();
                });
        });

        it('should return "UserNotFound" error trying to verify with not-found phone user', function (done) {
            var user = {
                username: '0000000000',
                password: 'ab',
                verify_code: '123'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserNotFound');
                    done();
                });
        });

        it('should return "UserIsBlocked" error trying to verify with blocked email user', function (done) {
            var user = {
                username: 'samthui7@gmail.com',
                password: 'ab',
                verify_code: '123'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserIsBlocked');
                    done();
                });
        });

        it('should return "UserIsBlocked" error trying to verify with blocked phone user', function (done) {
            var user = {
                username: '1111111111',
                password: 'ab',
                verify_code: '123'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('UserIsBlocked');
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
            request(server)
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
                    res.body.err.name.should.be.equal('MissingUsername');
                    done();
                });
        });

        it('should return "MissingPassword" error trying to verify code without password', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '',
                verify_code: '123'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('MissingPassword');
                    done();
                });
        });

        it('should return "PasswordTooShort" error trying to verify code with short password.', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '1',
                verify_code: '123'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('PasswordTooShort');
                    done();
                });
        });

        it('should return "MissingVerifyCode" error trying to verify without code', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '1234567890',
                verify_code: ''
            };

            request(server)
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
                    res.body.err.name.should.be.equal('MissingVerifyCode');
                    done();
                });
        });

        it('should return "WrongVerifyCode" error trying to verify with wrong code', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '1234567890',
                verify_code: '000'
            };

            request(server)
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
                    res.body.err.name.should.be.equal('WrongVerifyCode');
                    done();
                });
        });

        it('should return code 200 if verification done for email user', function (done) {
            var user = {
                username: 'siamtian2015@smisy.com',
                password: '1234567890',
                verify_code: '308372'
            };

            request(server)
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

            request(server)
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
    });*/
});