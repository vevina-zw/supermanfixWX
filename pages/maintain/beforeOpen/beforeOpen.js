// pages/maintain/beforeOpen/beforeOpen.js
let config = require("../../../config.js");
let util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // photoPath1: [],
    // photoPath2: [],
    engineerId: "",
    token: "",
    orderId: "",
    phone: "",
    customerId: "",
    hasScreen: "",
    photoPath1: "",//手机串号图片 url:visitPath，前端展示
    photoPath2: "",//手机待维修照片 url:visitPath，前端展示
    preImeiImg: "",//手机串号图片 url:absPath，传给disassemble接口
    preMaintainImg: "",//手机待维修照片 url:absPath，传给disassemble接口
    refuseReason: "",//取消原因
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = JSON.parse(options.orderId);
    let customerId = JSON.parse(options.customerId);
    let hasScreen = JSON.parse(options.hasScreen);
    this.setData({
      orderId: orderId,
      customerId: customerId,
      hasScreen: hasScreen
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
      phone: wx.getStorageSync("phone")
    })
  },
  //上传图片
  chooseImages: function(e) {
    let _this = this;
    let photoTag = e.currentTarget.dataset.tag;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function success(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        // _this.setData({
        //   [photoTag]: res.tempFilePaths,//res.tempFilePaths为数组格式
        // });
        _this.update(res.tempFilePaths, photoTag);
      }
    });
  },
  //上传图片到服务器，服务器返回图片url
  update: function (tempFilePaths,tag){
    let _this = this;
    wx.uploadFile({
      url: config.update_url,
      filePath: tempFilePaths[0],
      name: "file",
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        "bizType": "engMaintain",//文件类型:avatar(头像);engMaintain(工程师维修)
        "phone": _this.data.phone,
        "token": _this.data.token
      },
      success: function (res) {
        let data = JSON.parse(res.data);
        let visitPath = data.data.visitPath;
        let absPath = data.data.absPath;
        _this.setData({
          [tag]: visitPath,
        });
        if (tag =="photoPath1"){
          _this.setData({
            preImeiImg: absPath
          })
        } else if (tag == "photoPath2"){
          _this.setData({
            preMaintainImg: absPath
          })
        }
      }
    })
  },
  // 图片预览
  previewImage(e) {
    let _this = this;
    let photoTag = e.currentTarget.dataset.tag;
    let urls = [];
    urls.push(_this.data[photoTag]);
    wx.previewImage({
      urls,//数组
      current: e.currentTarget.dataset.item,
    })
  },
  // 删除图片
  deleteImg: function (e) {
    let photoTag = e.currentTarget.dataset.tag;
    this.setData({
      [photoTag]: ''
    });

    if (photoTag == "photoPath1") {
      this.setData({
        preImeiImg: ""
      })
    } else if (photoTag == "photoPath2") {
      this.setData({
        preMaintainImg: ""
      })
    }
  },
  //开始拆机
  startOpen: function () {
    let _this = this;
    let preImeiImg = _this.data.preImeiImg;
    let preMaintainImg = _this.data.preMaintainImg;
    if (!preImeiImg){
      wx.showToast({
        title: '请拍摄上传带串号手机正面照片',
        icon: 'none'
      })
      return;
    } else if (!preMaintainImg){
      wx.showToast({
        title: '请拍摄上传新料和特修手机照片',
        icon: 'none'
      })
      return;
    }
    let url= config.disassemble_url;
    let data= {
        engineerId: _this.data.engineerId,
        token: _this.data.token,
        orderId: _this.data.orderId,
        preImeiImg,
        preMaintainImg,
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      let orderId = JSON.stringify(_this.data.orderId);
      let customerId = JSON.stringify(_this.data.customerId);
      let hasScreen = JSON.stringify(_this.data.hasScreen);
      wx.navigateTo({
        url: `/pages/maintain/completed/completed?orderId=${orderId}&customerId=${customerId}&hasScreen=${hasScreen}`,
      })
    })
  },
  //获取取消原因
  getRefuse: function(e){
    // console.log(e.detail.value);
    this.setData({
      refuseReason: e.detail.value
    })
  },
  //拒绝订单
  refuseOrder: function () {
    let _this = this;
    let cancelReason = _this.data.refuseReason;
    if(!cancelReason){
      wx.showToast({
        title: "请描述取消/拒绝原因",
        icon: 'none'
      })
      return;
    }
    let url= config.cancel_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      orderId: _this.data.orderId,
      cancelReason
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      wx.switchTab({
        url: '/pages/order/orderLists/orderLists',
        success: function (res) {//还需测试：看跳转到订单列表页，订单状态是否刷新
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    })
  },
})