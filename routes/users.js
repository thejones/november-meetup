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
router.get('/:id', (req, res, next) => {
  const githubEndpoint = `https://api.github.com/users/${req.username}/repos?per_page=15`;
  axios.get(githubEndpoint)
    .then((response) => {
      const data = response.data;
      res.render('users', { data });
    });
});

module.exports = router;
