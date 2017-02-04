//User Model
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    createDate: {type: Date}
});

//查询注册邮箱是否已存在
UserSchema.statics.getUserByfindEmail = function(username, email, callback){
  this.find({email: email}, callback);
};

//查询注册用户名是否已存在
UserSchema.statics.getUserByfindUser = function(username, email, callback){
  //var cond = ['$or', {username: username}, {email: email}];
  this.find({username: username}, callback);
};

//新增用户
UserSchema.statics.addUser = function(user, callback){
  this.create(user, callback);
};

//查询用户
UserSchema.statics.getUser = function(username, password, callback){
  this.findOne({username: username, password: password}, callback);
};

//修改用户密码
UserSchema.statics.updatePassword = function(username, password, callback){
  this.update({username: username, password: password}, callback);
};



module.exports = mongoose.model('User', UserSchema);
