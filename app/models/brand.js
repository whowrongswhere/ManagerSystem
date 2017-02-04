//Brand Model
var mongoose = require('mongoose');

var BrandSchema = new mongoose.Schema({
    brandId: {type: String, required: true},
    firstTitle: {type: String, required: true},
    twoTitle: {type: String, required: true},
    content: {type: String, required: true},
    createDate: {type: Date},
    username: {type: String, required: true}    //登录的用户名，唯一性
});

//查询品牌列表数据
BrandSchema.statics.getBandData = function(username, callback){
  this.find({username: username}, callback);
};

//新增品牌
BrandSchema.statics.addBand = function(brand, callback){
  this.create(brand, callback);
};

//查询单个品牌数据
BrandSchema.statics.getOneBand = function(brandId, callback){
  this.findOne({brandId: brandId}, callback);
};

//修改品牌介绍
BrandSchema.statics.updateBand = function(brandId, update, callback){
  this.update({brandId: brandId}, update, callback);
};

//删除品牌介绍
BrandSchema.statics.removeBand = function(brandId, callback){
  this.remove({brandId: brandId}, callback);
};




module.exports = mongoose.model('Brand', BrandSchema);
