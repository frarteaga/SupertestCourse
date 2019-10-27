var express = require('express');
var router = express.Router();
let users = require('../Users');
const { check, validationResult } = require('express-validator');

/* GET all users */
router.get('/', function(req, res, next) {
  res.json(users);
});

/* GET a single user by id */
router.get('/:id', function(req, res, next) {
  let id = parseInt(req.params.id);
  let user = users.find(u => u.id === id);
  if (!user) {
    res
      .status(404)
      .json({ errorMsg: `No user with id of ${id} was found`});
  }
  else {
    res.json(user);
  }
});

const userValidationRules = [
  check('name').isString().isLength({ min: 1 }),
  check('email').optional().isEmail()
];

function checkForErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
}

/* PUT a single user by id */
router.put('/:id', userValidationRules, function(req, res, next) {
  if (checkForErrors(req, res))
    return;

  let id = parseInt(req.params.id);
  let user = users.find(u => u.id === id);
  if (!user) {
    res
      .status(404)
      .json({ errorMsg: `No user with id of ${id} was found`});
  }
  else {
    user.name = req.body.name ? req.body.name : user.name;
    user.email = req.body.email ? req.body.email : user.email;
    user.department = req.body.department 
        ? req.body.department 
        : user.department;
    res.json({ user });
  }
});

// create a new user
router.post('/', userValidationRules , function(req, res, next) {
  if (checkForErrors(req, res))
    return;

  let maxId = Math.max(...users.map(u => u.id));
  let newId = maxId + 1;
  let user = {
    id: newId,
    name: req.body.name,
    email: req.body.email,
    department: req.body.department
  }
  users.push(user);
  res.json({ user }); 
});

// remove a single user by id
router.delete('/:id', function(req, res, next) {
  let id = parseInt(req.params.id);
  let user = users.find(u => u.id === id);
  if (!user){
    res
      .status(404)
      .json({ errorMsg: `No user with id of ${id} was found`});
  }
  else{
    users = users.filter(u => u.id !== id);
    res.json(users);
  }
});

module.exports = router;
