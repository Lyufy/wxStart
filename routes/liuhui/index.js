var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with liuhui');
});

router.get('/test',function(req,res,next){
  res.send('demo  test');
});

module.exports = router;