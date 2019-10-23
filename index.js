var express = require('express');
var router = express.Router();
var handlers = require('./components/user/handlers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ id: 'anvh2' });
});

router.get('/me', function(req, res, next) {
  handlers.profile(req, res, next);
});

module.exports = router;
