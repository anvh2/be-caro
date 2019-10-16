var express = require('express');
var router = express.Router();
var handler = require('./components/user/handler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ id: 'anvh2' });
});

router.get('/me', function(req, res, next) {
  handler.profile(req, res, next);
});

module.exports = router;
