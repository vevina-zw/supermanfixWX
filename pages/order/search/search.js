// pages/order/search/search.js
var util = require('../../../utils/util.js');
let config = require("../../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchCondition: "",//搜索条件
    contactPhone: "",//搜索-订单客户电话
    orderId: "",//搜索-订单编号
    engineerId: "",
    token: "",
    pageNo: 1,//第几页
    pageSize: 10,//一页几行
    orderLists: [],//加载到的订单列表
    hasMoreData: true,//是否还有数据可加载
    noSearchData: false,//无查询结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    //现在json中设置enablePullDownRefresh为true，此方法才生效、
    if (!this.data.searchCondition) {
      wx.showToast({
        title: '请输入搜索条件',
        icon: 'none'
      })
      return
    }
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
    if (!this.data.searchCondition) {
      wx.showToast({
        title: '请输入搜索条件',
        icon: 'none'
      })
      return
    }
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
  initData: function () {
    this.setData({
      engineerId: wx.getStorageSync("engineerId"),
      token: wx.getStorageSync("token")
    })
  },

  //查询订单列表
  getOrderList() {
    let _this = this;
    let url= config.orderList_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      pageNo: _this.data.pageNo,//第几页
      pageSize: _this.data.pageSize,//一页几行
      contactPhone: _this.data.contactPhone,
      orderId: _this.data.orderId,
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      if (res.data.data.length <= 0 && res.data.firstPage == 0 && res.data.lastPage == 0) {//无查询结果
        _this.setData({
          noSearchData: true
        })
        return;
      }
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
  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let orderId = JSON.stringify(id);
    if (status == 6) {//已拆机
      wx.navigateTo({
        url: `/pages/maintain/completed/completed?orderId=${orderId}`
      })
    } else {
      wx.navigateTo({
        url: `/pages/order/orderDetail/orderDetail?orderId=${orderId}`
      })
    }
  },

  //获取input值
  searchInput: function(e){
    let val = e.detail.value;
    // console.log(val);
    this.setData({
      searchCondition: val,
      noSearchData: false
    })
  },
  //点击搜索按钮
  searchAction: function(){
    let _this = this;
    let condition = _this.data.searchCondition;
    if (!condition){
      wx.showToast({
        title: '请输入搜索条件',
        icon: 'none'
      })
    }else if (util.checkPhone(condition)){//手机号码
      _this.setData({
        contactPhone: condition
      })
    }else{//其他:订单标号
      _this.setData({
        orderId: condition
      })
    }
    _this.getOrderList();
  }
})