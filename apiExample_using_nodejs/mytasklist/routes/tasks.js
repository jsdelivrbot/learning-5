var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/tasks', function(req, res, next) {
  res.send('TASKS PAGE !!!');
});

module.exports = router;
