import * as server from '../src/App';
import * as request from 'supertest';
import * as chai from 'chai';
var expect = chai.expect;
var should = chai.should();
import { ErrorMessage } from './../src/Core/ErrorMessage';
import { ServiceManagement } from './../src/Modules/ServiceManagement/ServiceManagement';
import { EmployeeSchedule } from './../src/Modules/Schedule/EmployeeSchedule';
import { Authentication } from './../src/Core/Authentication/Authentication';
import { SignedInUser } from './../src/Core/User/SignedInUser';
import { Owner } from './../src/Core/User/Owner';
import { SalonManagement } from './../src/Modules/SalonManagement/SalonManagement';
import { ByPhoneVerification } from './../src/Core/Verification/ByPhoneVerification';
describe('Appointment Management', function () {
    var validToken;
    var invalidToken = 'eyJhbGciOiJSUz';
    var validSalonId;
    var invalidSalonId = "5825e0365193422";
    var notFoundSalonId = "5825e03651934227174513d8";
    var defaultPassword = '1234@1234';
    var employeeId;
    const date = new Date(2018, 3, 13);

    before(async function (done) {

        // Login and get token
        var user = {
            username: 'unittest1473044833007@gmail.com',
            password: defaultPassword
        };

        // 1. Create Owner 
        var authentication = new Authentication();
        const email = `${Math.random().toString(36).substring(7)}@salonhelps.com`;

        await authentication.signInWithUsernameAndPassword(email, defaultPassword);
        // 2. login to get access token
        var loginData: any = await authentication.signInWithUsernameAndPassword(email, defaultPassword);
        validToken = loginData.auth.token;
        // 3. Create salon
        var signedInUser = new SignedInUser(loginData.user._id, new SalonManagement(undefined));
        var salonInformationInput = {
            email: 'salon@salon.com',
            phone: {
                number: '7703456789',
                is_verified: false
            },
            location: {
                address: '2506 Bailey Dr NW, Norcross, GA 30071',
                is_verified: false,
                timezone_id: undefined
            },
            salon_name: 'Salon Appointment Test'
        }
        var salon: any = await signedInUser.createSalon(salonInformationInput);
        validSalonId = salon.salon_id;

        // 4. Add new employee
        const owner = new Owner(loginData.user._id, salon.data.salon_id);
        // Add new employee
        const employeeInput = {
            salon_id: validSalonId,
            role: 2,
            phone: "7703456789",
            fullname: "Jimmy Tran",
            nickname: "Jimmy",
            salary_rate: 0.6,
            cash_rate: 0.6
        };
        const employeeEmail = `${Math.random().toString(36).substring(7)}@gmail.com`;
        const employee: any = await owner.addEmployee(employeeEmail, employeeInput, new ByPhoneVerification());
        employeeId = employee.uid;

        done();
    });

    describe('Unit Test Create Appointment By Phone', function () {
        var apiUrl = '/api/v1/schedule/savesalonweekly';

        it('should return ' + ErrorMessage.InvalidTokenError.err.name + ' error trying to create appointment with invalid token', function (done) {
            var bodyRequest = {
               
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
    });
});