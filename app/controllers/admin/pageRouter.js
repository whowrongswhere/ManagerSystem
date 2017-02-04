/**
 * @author yaobei on 2017/1/8
 */

var express = require('express'),
  router = express.Router(),
  formidable = require("formidable"),
  path = require("path"),
  fs = require("fs"),
  md5 = require('md5'),
  UserModel = require('../../models/user'),
  BrandModel = require('../../models/brand');



module.exports = function (app) {
  app.use('/admin/pageRouter', router);
};


//登录后content部分内容页面
router.get('/index', function (req, res) {
  res.render('admin/page/index');
});

//显示修改密码页面
router.get('/resetPassword', function (req, res) {
  res.render('admin/page/resetPassword',{
    "password": req.session.user.password
  });
});

//修改密码操作
router.post('/doResetPassword', function (req, res) {
  var username = req.session.user.username;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  var newPasswordTwo = req.body.newPasswordTwo;

  var md5NewPassword = md5(md5(newPassword) + "nodejs");
  var md5NewPasswordTwo = md5(md5(newPasswordTwo) + "nodejs");

  if(newPassword == "" || newPasswordTwo == "" ) {
    res.send("-1");
    return;
  } else if(md5NewPassword != md5NewPasswordTwo) {
    res.send("-2");
    return;
  } else {
    //更改数据库当前用户的密码
    UserModel.updatePassword(username, md5NewPassword, function(err, user){
      if(user){
        res.send("1");
        return;
      } else {
        ep.emit('info_error', '密码修改失败！');
        return;
      }
    });
  }
});

//显示修改头像页面
router.get('/modifyAvatar', function (req, res) {
  res.render('admin/page/modifyAvatar');
});

//修改头像操作
router.post('/doModifyAvatar', function (req, res) {
  res.render('admin/page/modifyAvatar');
});



//显示新增品牌介绍页面
router.get('/addBand', function (req, res) {
  res.render('admin/page/addBrand');
});

//新增品牌节目操作
router.post('/doAddBand', function (req, res) {
  var username = req.session.user.username;
  var firstTitle = req.body.firstTitle;
  var twoTitle = req.body.twoTitle;
  var content = req.body.content;
  var createDate = new Date();
  var brandId = Math.random();

  BrandModel.addBand({
    brandId : brandId,
    firstTitle: firstTitle,
    twoTitle: twoTitle,
    content: content,
    createDate: createDate,
    username: username
  }, function (err, result) {
    if (result) {
      res.send("1");
    } else {
      res.send("-1");
    }
  });
});

//显示品牌介绍列表
router.get('/brandIntroduction', function (req, res) {
  var username = req.session.user.username;

  BrandModel.getBandData(username,function(err, result){
    res.render('admin/page/brandIntroduction',{
      "allBand":result
    });
});

//修改品牌介绍操作
router.post('/doEditBrand', function (req, res) {
    var brandId = req.body.brandId;
    var firstTitle = req.body.firstTitle;
    var twoTitle = req.body.twoTitle;
    var content = req.body.content;
    var update = {$set : {firstTitle : firstTitle, twoTitle : twoTitle, content : content}};

    BrandModel.updateBand(brandId, update, function(err, result){
      if(result){
        res.send("1");
        return;
      } else {
        res.send("-1");
        return;
      }
    });
});


//删除品牌介绍操作
router.post('/doRemoveBrand', function (req, res) {
  var brandId = req.body.brandId;

  BrandModel.removeBand(brandId, function(err, result){
    if(result){
      res.send("1");
      return;
    } else {
      res.send("-1");
      return;
    }
  });
});





});

