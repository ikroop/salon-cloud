import server = require('../src/App');
import { expect } from 'chai';
import  request = require('supertest');

describe('Server listening test', function () {
    before(function (done) {
       done();
    });
    after(function () {
    });

    it('responds to /', function testSlash(done) {
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('404 everything else', function testPath(done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
});
