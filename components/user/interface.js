var express = require('express');
var router = express.Router();
var handlers = require('./handlers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  handlers.login(req, res, next);
});

router.post('/register', function(req, res, next) {
  handlers.register(req, res, next);
});

router.post('/update', function(req, res, next) {
  handlers.update(req, res, next);
});

module.exports = router;
