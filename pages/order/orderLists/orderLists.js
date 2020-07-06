// pages/order/orderLists/orderLists.js
let config = require("../../../config.js");
let util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    engineerId: "",
    token: "",
    pageNo: 1,//第几页
    pageSize: 10,//一页几行
    orderLists: [],//加载到的订单列表
    hasMoreData: true,//是否还有数据可加载
    processingCount: 0,//进行中的订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
    // this.getOrderList();
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
    //初始化变量
    this.setData({
      pageNo: 1,
      orderLists: [],
      hasMoreData: true
    })
    //重新加载数据
    this.getOrderList();
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
    //现在json中设置enablePullDownRefresh为true，此方法才生效
    //初始化变量
    this.setData({
      pageNo: 1,
      orderLists: [],
      hasMoreData: true
    })
    //重新加载数据
    this.getOrderList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.hasMoreData) {
      wx.showToast({
        title: '已加载完毕',
        icon: 'none'
      })
      return;
    }
    this.getOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //初始化数据
  initData: function(){
    this.setData({
      engineerId: wx.getStorageSync("engineerId"),
      token: wx.getStorageSync("token")
    })
  },

  //查询订单列表
  getOrderList(){
    let _this = this;
    let url= config.orderList_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      pageNo: _this.data.pageNo,//第几页
      pageSize: _this.data.pageSize,//一页几行
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      let oldLists = _this.data.orderLists;
      let newLists = oldLists.concat(res.data.data);
      _this.setData({
        orderLists: newLists,
        processingCount: res.data.processingCount
      })
      if (res.data.isLastPage) {//加载完毕
        _this.setData({
          hasMoreData: false
        })
        wx.showToast({
          title: '已加载完毕',
          icon: 'none'
        })
      } else {
        _this.setData({
          pageNo: _this.data.pageNo + 1
        })
      }
    })
  },
  //→订单详情
  toDetail:function(e){
    let order = e.currentTarget.dataset.order;
    let customer = e.currentTarget.dataset.customer;
    let status = e.currentTarget.dataset.status;
    let screen = e.currentTarget.dataset.screen;//是否有屏幕问题（换屏需要在维修完成后上传6张图片，其他不需要）
    let orderId = JSON.stringify(order);
    let customerId = JSON.stringify(customer);
    let hasScreen = JSON.stringify(screen);
    if (status==6){//已拆机
      wx.navigateTo({
        url: `/pages/maintain/completed/completed?orderId=${orderId}&customerId=${customerId}&hasScreen=${hasScreen}`
      })
    }else{
      wx.navigateTo({
        url: `/pages/order/orderDetail/orderDetail?orderId=${orderId}`
      })
    }
  },
  //→搜索
  toSearch: function(){
    wx.navigateTo({
      url: "/pages/order/search/search"
    })
  }
})