var express = require('express');
var router = express.Router();
var handlers = require('./handlers');

router.get('/', (req, res, next) => {
  res.send('game here');
});

router.get('/find', (req, res, next) => {
  handlers.findMatch(req, res, next);
});

module.exports = router;
