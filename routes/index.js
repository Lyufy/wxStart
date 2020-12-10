var express = require('express');
var router = express.Router();
var userModel = require('../db/User/User');
var sha1 = require('sha1');
const sign = require('../utils/sign');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.get('/auth',function(req,res){
  let {signature,timestamp,nonce,echostr} = req.query;
  let token = 'testweixin';
  let array = [timestamp,nonce,token];
  array.sort(); //字典排序
  let str = array.join('');
  let resultStr = sha1(str);
  if (resultStr === signature){
    res.set('Content-Type','text/plain');
    res.send(echostr);
  }else{
    res.send('Error!!!!!');
  }
});

router.get('/reg',function(req,res){
  console.log(req.query);
  let{user,pwd} = req.query;
  new userModel({
    user:user,
    pwd:pwd
  }).save().then(()=>{
    res.send('注册成功');
  })
  res.send('33333');
});
router.get('/qiyan',function(req,res){
  res.send('戚燕小可爱');
});
router.get('/jsapi',async function(req,res){
  let url = decodeURIComponent(req.query.url);
  let conf = await sign(url);
  res.send(conf);
});

