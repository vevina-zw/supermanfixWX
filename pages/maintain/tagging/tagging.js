// pages/maintain/tagging/tagging.js
let config = require("../../../config.js");
let util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    engineerId: "",
    token: "",
    customerId: "",
    pageNo: 1,//第几页
    pageSize: 100,//一页几行
    tagLists: [],//加载到的标签列表
    hasMoreData: true,//是否还有数据可加载
    tagNames: [],//选中的标签，传给后端
    definedTag: '',//自定义标签
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let customerId = JSON.parse(options.customerId);
    this.setData({
      customerId: customerId
    })
    this.initData();
    this.getTagList();
    this.addAttribute();
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
    if (!this.data.hasMoreData) {
      wx.showToast({
        title: '已加载完毕',
        icon: 'none'
      })
      return;
    }
    this.getTagList();
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

  //获取标签库列表
  getTagList() {
    let _this = this;
    let url= config.tagList_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      pageNo: _this.data.pageNo,//第几页
      pageSize: _this.data.pageSize,//一页几行
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      let oldLists = _this.data.tagLists;
      let newLists = oldLists.concat(res.data.data);
      _this.setData({
        tagLists: newLists,
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

  //自定义标签
  defineTag: function(e){
    let val = e.detail.value;
    this.setData({
      definedTag: val
    })
  },
  //+自定义标签
  addDefineTag: function(){
    if (this.data.definedTag==''){
      return;
    }
    
    let definedTag = {
      tagName: this.data.definedTag
    }
    let tagLists = this.data.tagLists;
    tagLists.push(definedTag);
    this.setData({
      tagLists: tagLists,
      definedTag: ''
    })
    // wx.showToast({
    //   title: '自定义标签提交成功，请等待后台审核',
    //   icon: 'none',
    //   duration: 2000
    // })
  },

  //给tagLists数组中的每个对象添加checked属性（初始默认值都为false）
  addAttribute: function(){
    let tagLists = this.data.tagLists;
    let newLists = tagLists.map((item, index) => {
      return Object.assign(item, { checked: false })
    })
    this.setData({
      tagLists: newLists
    })
  },
  //点击标签，增加选中样式（多选）
  checkTag(e){
    let index = e.currentTarget.dataset.index;
    let newLists = this.data.tagLists;
    newLists[index].checked = !newLists[index].checked;

    let tagNames = [];
    newLists.forEach((item, index, arr) => {
      if (item.checked){
        tagNames.push(item.tagName);
      }
    })

    this.setData({
      tagLists: newLists,
      tagNames: tagNames
    })
  },

  //保存
  saveTag() {
    let _this = this;
    let url= config.addCustomerTag_url;
    let data= {
      engineerId: _this.data.engineerId,
      token: _this.data.token,
      customerId: _this.data.customerId,
      tagNames: _this.data.tagNames,
    };
    util.wxRequest('POST', url, data, (res) => {
      console.log(res.data)
      wx.showToast({
        title: '保存成功',
        icon: 'none',
        duration: 1000,
        success: function () {
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/order/orderLists/orderLists',
            })
          }, 1000);
        }
      })
    })
  },
})