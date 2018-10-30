var express = require('express');

// learn-sequelize/models/index.js의 User 객체를 User 변수 객체에 연결
var User = require('../models').User;

var router = express.Router();

// GET / 로 접속했을 때의 라우터
/*
  Promise 형식
  router.get('/', function(req, res, next) {
    User.findAll()
      .then((users) => {
        res.render('sequelize', { users });
      })
      .catch((err) => {
        console.error(err);
        next(err); // 에러 핸들러로 바로 이동
      })
    });
*/

// async/await 문법
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.render('sequelize', { users });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
