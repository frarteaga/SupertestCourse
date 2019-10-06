var express = require('express');
var router = express.Router();
const users = require('../Users');

/* GET all users */
router.get('/', function(req, res, next) {
  res.json(users);
});

/* GET a single user by id */
router.get('/:id', function(req, res, next) {
  let id = req.params.id;
  let user = users.find(u => u.id == id);
  if (!user) {
    res.status(404).end();
  }
  else {
    res.json(user);
  }
});

module.exports = router;
