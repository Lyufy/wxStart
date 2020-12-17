var express = require('express');
var router = express.Router();
var userModel = require('../db/User/User');
var sha1 = require('sha1');
const sign = require('../utils/sign');
let parseString = require('xml2js').parseString;
let {textMsg,message} = require('../wxMsg/wxmsg');

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
  console.log('str',str);
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
router.post('/auth', (req, res) => {
  try {
      let buffer = [];
      // 监听data事件，用于接收数据，用req.body是拿不到数据的
      req.on('data', (data) => {
          buffer.push(data);
      });
      // 监听end事件，用于处理接收完成的数据
      req.on('end', () => {
          parseString(Buffer.concat(buffer).toString('utf-8'), {
              explicitArray: false
          }, (err, result) => {
              // 处理错误
              if (err) {
                  console.log('解析微信服务器发来的消息出错了：');
                  console.log(err);
                  res.send('success');
                  return false;
              }

              if (!result || !result.xml) {
                  // 未接收到有效消息，告诉微信服务器不要再尝试连接
                  res.send('success');
                  return console.log('未接收到任何消息也未发生任何事件');
              }

              result = result.xml;
              // 接收方微信（注意接收方和发送方的转换
              let toUser = result.FromUserName;
              // 发送方微信
              let fromUser = result.ToUserName;
              //userMessage是用户发送的信息
              let userMessage = result.Content;

              console.log('-----------------------开始处理消息-----------------------');

              if (result.Event == 'subscribe') {
                  // 如果是用户关注
                  console.log('--------------------有用户关注了---------------------------');
                  res.send(textMsg(toUser,fromUser,'感谢关注'));
              } else {
                  // 其他消息
                  if (result.MsgType != 'text') {
                      res.send('success');
                      console.log('------------------不是文本类型的消息暂不处理----------------------');
                      return false;
                  }
                  
                  // 文本消息

                  // 这里可以处理一些特殊回复，比如发送编码查询等

                  // 处理关键词自动回复
                  console.log('-----------------------现在处理关键词回复------------------------');
                  res.send(textMsg(toUser, fromUser, message(userMessage)));
              }
          });
      });
  } catch(err) {
      console.log(err);
      res.send('success');
  }
});
/**
 * [handleAutoReply description]
 * @param  {Object} res         [response对象]
 * @param  {String} toUser      [接收方]
 * @param  {String} fromUser    [发送方]
 * @param  {String} keyword     [关键词]
 * @return {String} xmlContent  [消息模板]
 */
function handleAutoReply(res, toUser, fromUser, keyword) {
  // messageMap是含有关键词回复key-value的json，根据不同的关键词，向用户发送不同消息
  let messageMap = JSON.parse(JSON.stringify(res));
  let content = messageMap[keyword];
  if (!content) {
      res.send('success');
      return false;
  }

  let xml = returnText(toUser, fromUser, content);
  res.send(xml); 
}
/**
 * [returnText description]
 * @param  {String} toUser      [接收方]
 * @param  {String} fromUser    [发送方]
 * @param  {String} content     [消息内容]
 * @return {String} xmlContent  [消息模板]
 */
function returnText(toUser, fromUser, content) {
  let xmlContent = `<xml><ToUserName><![CDATA[${toUser}]]></ToUserName>
  <FromUserName><![CDATA[${fromUser}]]></FromUserName>
  <CreateTime>${new Date().getTime()}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${content}]]></Content></xml>`;
  return xmlContent;
}



