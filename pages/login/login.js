// pages/login/login.js
let config = require("../../config.js");
let util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
    errMsg: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取input值
  phoneInput: function (e) {
    let val = e.detail.value;
    this.setData({
      phone: val,
      errMsg: ""
    })
  },
  pwdInput: function (e) {
    let val = e.detail.value;
    this.setData({
      password: val,
      errMsg: ""
    })
  },
  //登录
  loginAction: function(){
    let _this = this;
    let phone = _this.data.phone;
    let pwd = _this.data.password;
    //前端校验
    if (phone == "" || !phone){
      _this.setData({
        errMsg: "手机号码不能为空"
      })
      return;
    }else if(!util.checkPhone(phone)) {
      _this.setData({
        errMsg: "请输入正确的手机号"
      })
      return;
    } else if (pwd == "" || !pwd) {
      _this.setData({
        errMsg: "密码不能为空"
      })
      return;
    }
    //登录接口
    let url = config.login_url;
    let data = { phone, pwd };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      //登录成功
      wx.setStorageSync("engineerId", res.data.data.engineerId);
      wx.setStorageSync("token", res.data.data.token);
      wx.setStorageSync("phone", phone);
      wx.switchTab({
        url: '/pages/order/orderLists/orderLists',
      })
    }
    // , (err) => {
    //   console.log(err.errMsg)
    // }
    )
  }
})