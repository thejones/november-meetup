const app = require("../app");
var supertest = require("supertest");

describe('Correctly deals with user stuff', function(){

  let request;
  beforeEach(function() {
    request = supertest(app)
      .get("/users/thejones");
  })

  it("returns an HTML response", function(done) {
    request
      .expect("Content-Type", /html/)
      .expect(200, done);
  })

  it("Returns the github user name", function(done) {
    request
      .expect("Content-Type", /html/)
      .expect(200)
      .expect(/thejones/)
      .end(done)
  })

});