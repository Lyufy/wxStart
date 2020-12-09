var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({  //User表结构
    user:String,
    pwd:String
});

var userModel = mongoose.model('User',User);  //操作表结构的model对象

module.exports = userModel;