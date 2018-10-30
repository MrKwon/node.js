var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); // 클라이언트에 응답을 보냄
});

module.exports = router;
