# Start 
* Install Express (CLI)
* Create a Repo on Github
* Create a project with Express Generator & save to github

```
$ express --view=hbs server
$ git add . && git commit -m "Express app from generator"
$ git push origin master
```

# Setup testing
* Install mocha and chai & supertest
```
$ npm install --save-dev mocha chai supertest
```

```  
// package.json
"scripts": {
  "start": "node ./bin/www",
  "test": "mocha",
  "test:watch": "mocha --watch"
}
 ```

 * Create testing directories
 
 ``` 
 $ mkdir test
 ```

# Add some npm deps

```
$ npm i --save response-time axios
```
* PS use Yarn instead [https://yarnpkg.com/](https://yarnpkg.com/)
* Axios is popular (not really needed)
* Response time will help show just that. Also, optional.
```
  "dependencies": {
    "body-parser": "~1.15.2",
    "cookie-parser": "~1.4.3",
    "debug": "~2.2.0",
    "express": "~4.14.0",
    "hbs": "~4.0.1",
    "morgan": "~1.7.0",
    "serve-favicon": "~2.3.0"
  },
  "devDependencies": {
    "chai": "^3.5.0",
    "mocha": "^3.1.2",
    "supertest": "^2.0.1"
  }
```
# Write some passing tests

* Inside test create 2 files.
```
$ touch pages.js
$ touch users.js
```

* This wouls normally match your js file name to some degree. We are only using two files today!
* Add the follwing to the pages.js:
```
var app = require("../app");
var request = require("supertest");

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
```

# Write a failing test 
* We want to fail, fix, be happy!
```
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
      .expect(200)
      .end(done);
  })

});
 ```

 The important piece here is that we have not written a route, controller, or view for 
 anything at ```/users/:id```. This should fail!

 # Get our test to pass
 * Write a route, view, etc for ```users/:id``` so our test will pass.

 ```
 // routes/users.js
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  res.render('user');
});

module.exports = router;
```

* Create a new view ```$ touch views/user.hbs```
```
// views/user.hbs
<div>Our github user view</div>
```
* Our tests should now pass. 

# Rinse and repeat A.K.A Red, Green, Refactor
* From this point forward you will write a failing test, get it to pass, and adjust as needed.
```
// user.test.js
  it("Returns the github user name", function(done) {
    request
      .expect("Content-Type", /html/)
      .expect(200)
      .expect(/thejones/)
      .end(done)
  })

```
* The easiest way to get this test to pass is to enter the user name directly into the html.
```
// user.hbs
<div>Our github user view</div>
<div>Username: thejones</div>
```
* The tests should now pass again. Time to refactor!

# Request the user from github.
* We want to hit the github api and return the correct info. We will use Axios. 
```
// routes/user.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  const username = req.params.id;
  const githubEndpoint = `https://api.github.com/users/${username}/repos?per_page=10`;
  axios.get(githubEndpoint)
  .then((response) => {
    const data = response.data;
    res.render('users', {data});
  });
  
});

module.exports = router;
```
* Notice we make a request and then pass the response.data into the view.
* Next we need to remove that hardcoded username from the view.
```
// users.hbs
<div>Our github user view</div>
<div>data: {{data.[0].owner.login}}</div
```
* We can also use Express params. The router would look like this: 
```
const express = require('express');
const router = express.Router();
const axios = require('axios');

/* Use them Params */
router.param('id', (req, res, next, id) => {
  // Killer place to set an inital query or something.
  // We are just setting the username. 
  req.username = id;
  next()
});

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  const githubEndpoint = `https://api.github.com/users/${req.username}/repos?per_page=10`;
  axios.get(githubEndpoint)
    .then((response) => {
      const data = response.data;
      res.render('users', { data });
    });

});

module.exports = router;
```
* We set the username on the request object.
