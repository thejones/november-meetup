var app = require("../app");
var request = require("supertest")

describe("html response", function () {
    it('Returns a 200 status code', function (done) {

        request(app)
            .get('/')
            .expect(200, done);

    });

    it('Returns a 404 status code', function (done) {

        request(app)
            .get('/doesnotexist')
            .expect(404, done);

    });
}); 
