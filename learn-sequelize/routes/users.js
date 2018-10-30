var express = require('express');
var User = require('../models').User;

var router = express.Router();

// GET /users 주소로 요청이 들어올 경우의 라우터
router.get('/', async (req, res, error) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /user 주소로 요청이 들어올 경우의 라우터
router.post('/', async (req, res, error) => {
  try {
    const result = await User.create({
      name: req.body.name,
      age: req.body.age,
      married: req.body.married,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
