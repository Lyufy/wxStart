//回复文字消息
textMsg = function (toUser, fromUser, content) {
    var resultXml = "<xml><ToUserName><![CDATA[" + toUser + "]]></ToUserName>";
    resultXml += "<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>";
    resultXml += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
    resultXml += "<MsgType><![CDATA[text]]></MsgType>";
    resultXml += "<Content><![CDATA[" + content + "]]></Content></xml>";
    console.log(resultXml);
    return resultXml;
}
/*
*   data:用户发送的信息
*/
message = function (data) {
    var content;
    if (data === "你好" || data === "hello" || data === "hi") {
        content = "欢迎光临小许客栈!"
    } else if (data === "待办") {
        content = "http://liuhuiftd.applinzi.com/#/ToDoList";
    } else {
        content = "敬请期待";
    }
    return content;
}

module.exports = {textMsg,message}
