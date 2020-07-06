// pages/maintain/payCode/payCode.js
let config = require("../../../config.js");
let util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",
    customerId: "",
    engineerId: "",
    token: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = JSON.parse(options.orderId);
    let customerId = JSON.parse(options.customerId);
    this.setData({
      orderId: orderId,
      customerId: customerId
    })
    this.initData();
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

  //初始化数据
  initData: function () {
    this.setData({
      engineerId: wx.getStorageSync("engineerId"),
      token: wx.getStorageSync("token"),
      // phone: wx.getStorageSync("phone")
    })
  },
  goTagging: function(){
    let _this = this;
    let data = {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      orderId: _this.data.orderId
    };
    let url = config.finishPay_url;
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      let customerId = JSON.stringify(this.data.customerId);
      wx.navigateTo({
        url: `/pages/maintain/tagging/tagging?customerId=${customerId}`,
      })
    })
  }
})