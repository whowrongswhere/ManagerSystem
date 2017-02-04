var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  md5 = require('md5'),
  eventproxy = require('eventproxy'),
  UserModel = require('../../models/user');


module.exports = function (app) {
  app.use('/admin/users', router);
};

//权限控制--用户登录后才可进行相关操作
module.exports.requireLogin = function (req, res, next) {
  var ep = new eventproxy();
  ep.on('info_error', function (msg) {
    res.status(422);
    res.render('admin/sign/login', {error: msg});
  });
  if (req.session.user) {
    next();
  } else {
    ep.emit('info_error', '只有登录用户才能访问');
    return;
  }
};

//显示登录页面
router.get('/login', function (req, res) {
  res.render('admin/sign/login', {
    error: '',
    success: ''
  });
});
router.get('/login', function (req, res) {
  res.render('admin/sign/login', {
    error: '',
    success: ''
  });
});

//用户登录操作
router.post('/doLogin', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var ep = new eventproxy();
  ep.on('info_error', function (msg) {
    res.status(422);
    res.render('admin/sign/login', {error: msg});
  });

  if(!username || !password){
    ep.emit('info_error', '您填写的信息不完整');
    return;
  }
   password = md5(md5(password) + "nodejs"); //md5加密后的密码
   //查询数据库是否存在该用户
   UserModel.getUser(username, password, function(err, user){
      if(user){
        req.session.user = user;
        res.render('admin/adminIndex', {
          "username": req.session.user.username,
          "password": req.session.user.password,
          "email": req.session.user.email
        });
      } else {
        ep.emit('info_error', '用户名或者密码错误！');
        return;
      }
  });
});

//注销操作
router.get('/signout',function(req, res){
  req.session.destroy();
  //跳转到登录页面
  res.render('admin/sign/login');
});


//用户注册操作
router.post('/doRegister', function (req, res, next) {
  //获取注册信息
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var rePassword = req.body.rePassword;
  var ep = new eventproxy();
  ep.on('info_error', function (msg) {
    res.status(422);
    res.render('admin/sign/login', {error: msg});
  });

  //校验数据
  var hasEmptyInfo = [email, username, password, rePassword].some(function (item) {
    return item === '';
  });
  var isPassDiff = password !== rePassword;

  if (hasEmptyInfo || isPassDiff) {
    ep.emit('info_error', '注册信息错误');
    return;
  }
  password = md5(md5(password) + "nodejs"); //md5加密后的密码
  var createDate = new Date(); //注册时间

  //保存到数据库
  UserModel.getUserByfindEmail(username, email, function (err, users) {
    if (err) {
      ep.emit('info_error', '获取用户数据失败！');
      return;
    }
    if (users.length > 0) {
      ep.emit('info_error', '邮箱被占用！');
      return;
    }
    UserModel.getUserByfindUser(username, email, function (err, users) {
      if (err) {
        ep.emit('info_error', '获取用户数据失败！');
        return;
      }
      if (users.length > 0) {
        ep.emit('info_error', '用户名被占用！');
        return;
      }
      UserModel.addUser({
        username: username,
        email: email,
        password: password,
        createDate: createDate
      }, function (err, result) {
        if (result) {
          res.render('admin/sign/login', {success: '恭喜你，注册成功'});
        } else {
          ep.emit('info_error', '注册失败！');
        }
      })
    });
  });


});
