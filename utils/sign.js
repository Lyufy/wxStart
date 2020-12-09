var {appid,secret} = require('../config');
var axios = require('axios');
var sha1 = require('sha1');

//1.access_token 获取
//https请求方式: GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
//2.jsapi获取
// https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi
async function getTicket(){
    //获取jsapi_ticket的方法
    let tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    let token_data = await axios.get(tokenUrl);
    let access_token = token_data.data.access_token; //得到access_token
    let ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
    let ticket_data = await axios.get(ticketUrl); //得到jsapi_ticket
    return ticket_data.data.ticket;
}

var createNonceStr = function(){ 
    //生成随即字符串
    return Math.random().toString(36).substr(2,15);
}

var createTimestamp = function(){
    //生成时间戳
    return parseInt(new Date().getTime()/1000) + '';
} 

 var sign =async function(url){
     //生成signature签名的方法
     //签名生成规则如下：
     //1.参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。
     //2.对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。
     //这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
     let jsapi_ticket = await getTicket();
     var obj = {
         jsapi_ticket,
         nonceStr : createNonceStr(),
         timestamp : createTimestamp(),
         url, 
     };
     var keys = Object.keys(obj);
     keys = keys.sort();
     var newObj = {};
     keys.forEach((key) => {
        newObj[key.toLowerCase()] = obj[key]; 
     })
     var str1 = '';
     for(var k in newObj){
         str1 += '&' + k + '=' + newObj[k];
     }
     str1 = str1.substr(1);
     var signature = sha1(str1);
     obj.signature = signature;
     //将appid挂载到obj上
     obj.appId = appid;
     return obj;
 }

 module.exports = sign;