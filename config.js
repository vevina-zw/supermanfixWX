let BASR_URL = "https://www.supermanfix.com/smf";  //PRO
// let BASR_URL = "http://47.100.111.188:8082/smf";  //TEST
let config = {
  BASR_URL,
  login_url: BASR_URL + "/api/eng/auth/login",//登录
  logout_url: BASR_URL + "/api/eng/auth/logout",//登出
  rank_url: BASR_URL + "/api/eng/my/rank",//我的-排名
  orderList_url: BASR_URL + "/api/eng/order/list",//订单列表
  orderDetail_url: BASR_URL + "/api/eng/order/detail",//订单详情
  customerInfo_url: BASR_URL + "/api/eng/customer/info",//客户个人信息
  customerOrders_url: BASR_URL + "/api/eng/customer/orders",//查询客户的所有订单
  receiveOrder_url: BASR_URL + "/api/eng/order/receive",//工程师接单
  begainMaintain_url: BASR_URL + "/api/eng/order/begainMaintain",//工程师开始维修
  update_url: BASR_URL + "/api/file/upload",//上传图片
  disassemble_url: BASR_URL + "/api/eng/order/disassemble",//开始拆机
  finish_url: BASR_URL + "/api/eng/order/finish",//维修完成
  cancel_url: BASR_URL + "/api/eng/order/cancel",//取消订单
  finishPay_url: BASR_URL + "/api/eng/order/finishPay",//支付完成
  tagList_url: BASR_URL + "/api/eng/tag/list",//标签库列表
  addCustomerTag_url: BASR_URL + "/api/eng/tag/add4Customer",//给用户添加标签
  myTag_url: BASR_URL + "/api/eng/tag/my",//我的标签
}
module.exports = config;