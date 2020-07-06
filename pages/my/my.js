// pages/my/my.js
let config = require("../../config.js");
let util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    engineerId: "",
    token: "",
    myData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
    this.getRank();
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
      token: wx.getStorageSync("token")
    })
  },

  getRank: function(){
    let _this = this;
    let url = config.rank_url;
    let data = {
      engineerId: _this.data.engineerId,
      token: _this.data.token
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      _this.setData({
        myData: res.data.data
      })
    })
  },
  
  //退出登录
  logoutAction: function(){
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function(res){
        if (res.confirm) {
          let url= config.logout_url;
          let data= {
            engineerId: _this.data.engineerId,
            token: _this.data.token
          };
          util.wxRequest('POST', url, data, (res) => {
            console.log(res.data)
            //登出成功
            wx.removeStorageSync("engineerId");
            wx.removeStorageSync("token");
            wx.removeStorageSync("phone");
            wx.redirectTo({
              url: '/pages/login/login'
            })
          })
        }
      }
    })
  }
})