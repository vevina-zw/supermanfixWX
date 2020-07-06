// pages/maintain/completed/completed.js
let config = require("../../../config.js");
let util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // photoPath1: [],
    // photoPath2: [],
    // photoPath3: [],
    // photoPath4: [],
    // photoPath5: [],
    // photoPath6: [],
    engineerId: "",
    token: "",
    orderId: "",
    phone: "",
    photoPath1: "",//url:visitPath，前端展示。下同
    photoPath2: "",
    photoPath3: "",
    photoPath4: "",
    photoPath5: "",
    photoPath6: "",
    finishedImeiImg: "",//维修完成后的串号正面照 url:absPath，传给disassemble接口。下同
    finishedBackImg: "",//维修完成后的串号背面照 url
    finishedLeftUpImg: "",//维修完成后的左上角 url
    finishedRightUpImg: "",//维修完成后的右上角 url
    finishedLeftDownImg: "",//维修完成后的左下角 url
    finishedRightDownImg: "",//维修完成后的右下角 url
    refuseReason: "",//textarea输入框的值：取消原因/订单备注
    customerId: "",
    hasScreen: false,////是否有屏幕问题（换屏需要在维修完成后上传6张图片，其他不需要）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = JSON.parse(options.orderId);
    let customerId = options.customerId? JSON.parse(options.customerId): "";
    let hasScreen = options.hasScreen ? JSON.parse(options.hasScreen) : false;
    this.setData({
      orderId: orderId,
      customerId: customerId,
      hasScreen: hasScreen
    })
    console.log(this.data.hasScreen);
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
        console.log(photoTag);
        console.log(_this.data[photoTag]);
        _this.update(res.tempFilePaths, photoTag);
      }
    });
  },
  //上传图片到服务器，服务器返回图片url
  update: function (tempFilePaths, tag) {
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
        console.log(visitPath)
        _this.setData({
          [tag]: visitPath,
        });
        if (tag == "photoPath1") {
          _this.setData({
            finishedImeiImg: absPath
          })
        } else if (tag == "photoPath2") {
          _this.setData({
            finishedBackImg: absPath
          })
        } else if (tag == "photoPath3") {
          _this.setData({
            finishedLeftUpImg: absPath
          })
        } else if (tag == "photoPath4") {
          _this.setData({
            finishedRightUpImg: absPath
          })
        } else if (tag == "photoPath5") {
          _this.setData({
            finishedLeftDownImg: absPath
          })
        } else if (tag == "photoPath6") {
          _this.setData({
            finishedRightDownImg: absPath
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
      current: _this.data[photoTag],
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
        finishedImeiImg: ""
      })
    } else if (photoTag == "photoPath2") {
      this.setData({
        finishedBackImg: ""
      })
    } else if (photoTag == "photoPath3") {
      this.setData({
        finishedLeftUpImg: ""
      })
    } else if (photoTag == "photoPath4") {
      this.setData({
        finishedRightUpImg: ""
      })
    } else if (photoTag == "photoPath5") {
      this.setData({
        finishedLeftDownImg: ""
      })
    } else if (photoTag == "photoPath6") {
      this.setData({
        finishedRightDownImg: ""
      })
    }
  },
  //维修完成
  completedWork: function(){
    let _this = this;
    let finishedImeiImg = _this.data.finishedImeiImg;
    let finishedBackImg = _this.data.finishedBackImg;
    let finishedLeftUpImg = _this.data.finishedLeftUpImg;
    let finishedRightUpImg = _this.data.finishedRightUpImg;
    let finishedLeftDownImg = _this.data.finishedLeftDownImg;
    let finishedRightDownImg = _this.data.finishedRightDownImg;
    let hasScreen = _this.data.hasScreen;
    if (hasScreen && (!finishedImeiImg || !finishedBackImg || !finishedLeftUpImg || !finishedRightUpImg || !finishedLeftDownImg || !finishedRightDownImg)){
      wx.showToast({
        title: '维修屏幕问题，请拍摄上传所有要求的图片',
        icon: 'none'
      })
      return;
    }

    let url= config.finish_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      orderId: _this.data.orderId,
      malfunctionRemark: _this.data.refuseReason ? _this.data.refuseReason : '',
      finishedImeiImg,
      finishedBackImg,
      finishedLeftUpImg,
      finishedRightUpImg,
      finishedLeftDownImg,
      finishedRightDownImg
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      let orderId = JSON.stringify(_this.data.orderId);
      let customerId = JSON.stringify(_this.data.customerId);
      wx.navigateTo({
        url: `/pages/maintain/payCode/payCode?orderId=${orderId}&customerId=${customerId}`
      })
    })
  },
  //获取取消原因
  getRefuse: function (e) {
    // console.log(e.detail.value);
    this.setData({
      refuseReason: e.detail.value
    })
  },
  //拒绝订单
  refuseOrder: function () {
    let _this = this;
    let cancelReason = _this.data.refuseReason;
    if (!cancelReason) {
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