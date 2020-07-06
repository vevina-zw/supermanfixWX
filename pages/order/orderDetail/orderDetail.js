// pages/order/orderDetail/orderDetail.js
let config = require("../../../config.js");
let util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_memberInfo: false,//是否展示会员信息
    engineerId: "",
    token: "",
    orderId: "",
    orderDetail: null,//订单详情
    orderStatusCode: "",//订单状态码
    payStatus: "",//订单支付码
    customerInfo: null,//客户信息
    pageNo: 1,//第几页
    pageSize: 10,//一页几行
    orderLists: [],//加载到的订单列表
    hasMoreData: true,//是否还有数据可加载
    customerId:"",//客户id，后面给客户打标签要用
    hasScreen: false,////是否有屏幕问题（换屏需要在维修完成后上传6张图片，其他不需要）
    customerTags: "",//客户标签
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = JSON.parse(options.orderId);
    this.setData({
      orderId: orderId
    })
    this.initData();
    this.getOrderDetail();
    this.getCustomerInfo();
    this.getCustomerOrders();
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
    //现在json中设置enablePullDownRefresh为true，此方法才生效
    //初始化变量
    this.setData({
      pageNo: 1,
      orderLists: [],
      hasMoreData: true
    })
    //重新加载数据
    this.getCustomerOrders();
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
    this.getCustomerOrders();
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

  //查询订单详情
  getOrderDetail: function(){
    let _this = this;
    let url= config.orderDetail_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      orderId: _this.data.orderId
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      _this.setData({
        orderDetail: res.data.data,
        orderStatusCode: res.data.data.orderStatusCode,
        payStatus: res.data.data.payStatus,
        customerId: res.data.data.customerId,
        hasScreen: res.data.data.hasScreenMalfunction,
      })
      _this.getCustomerTag();
    })
  },
  //客户个人信息
  getCustomerInfo: function () {
    let _this = this;
    let url= config.customerInfo_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      orderId: _this.data.orderId
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      _this.setData({
        customerInfo: res.data.data
      })
    })
  },
  //查询客户标签
  getCustomerTag: function () {
    let _this = this;
    let url= config.myTag_url;
    let data= {
      customerId: _this.data.customerId,
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      _this.setData({
        customerTags: res.data.data.tags
      })
    })
  },
  //查询客户的所有订单
  getCustomerOrders() {
    let _this = this;
    let url= config.customerOrders_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      orderId: _this.data.orderId,
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
  //开始收到订单
  startReceive: function(){
    let _this = this;
    let url= config.receiveOrder_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      orderId: _this.data.orderId
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      //接单成功
      _this.setData({
        orderStatusCode: 4
      })
    })
  },
  //开始检测维修
  startMaintain: function(){
    let _this = this;
    let url= config.begainMaintain_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      orderId: _this.data.orderId
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      //“开始维修”成功
      let orderId = JSON.stringify(_this.data.orderId);
      let customerId = JSON.stringify(_this.data.customerId);
      let hasScreen = JSON.stringify(_this.data.hasScreen);
      wx.navigateTo({
        url: `/pages/maintain/beforeOpen/beforeOpen?orderId=${orderId}&customerId=${customerId}&hasScreen=${hasScreen}`
      })
    })
  },
  //继续维修
  continueMaintain: function(){
    let orderId = JSON.stringify(this.data.orderId);
    let customerId = JSON.stringify(this.data.customerId);
    let hasScreen = JSON.stringify(this.data.hasScreen);
    wx.navigateTo({
      url: `/pages/maintain/beforeOpen/beforeOpen?orderId=${orderId}&customerId=${customerId}&hasScreen=${hasScreen}`
    })
  },
  //未支付订单，跳转到支付码页面
  goPayCode: function(){
    let orderId = JSON.stringify(this.data.orderId);
    let customerId = JSON.stringify(this.data.customerId);
    wx.navigateTo({
      url: `/pages/maintain/payCode/payCode?orderId=${orderId}&customerId=${customerId}`
    })
  },

  tel: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.orderDetail.contactPhone,
    })
  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  showMemberInfo: function () {
    let show_memberInfo = this.data.show_memberInfo;
    this.setData({
      show_memberInfo: !show_memberInfo
    })
  },
})