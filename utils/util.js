const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 校验手机号码
const checkPhone = phone => {
  if (/^1[3456789]\d{9}$/.test(phone)) {
    return true;
  }else{
    return false;
  }
}
//校验中文名字
const checkName = name => {
  // 中文 /^ [\u4e00-\u9fa5]{1,20} $ /
  // 英文 /^ [a-zA-Z\.\s]{1,20}$/
  if (/^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/.test(name)) {
    return true;
  } else {
    return false;
  }
}

const wxRequest = (method, url, data, callback, errFun) =>{
  /**
  * 封装wx.request请求
  * method： 请求方式
  * url: 请求地址
  * data： 要传递的参数
  * callback： 请求成功回调函数
  * errFun： 请求失败回调函数
  **/
  wx.request({
    url: url,
    method: method,
    data: data,
    header: {
      'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    dataType: 'json',
    success: function (res) {
      if (res.statusCode != 200) {
        wx.showToast({
          title: res.errMsg || "服务器异常",
          icon: 'none'
        })
        return;
      } else if (res.data.code == -100 || res.data.code == -106 || res.data.code == -109) {//未登录/登录失效
        /**
        -100 未登录；-106 token无效；-109 工程师id为空；-102 手机号码已注册,请登陆；-110  此手机号码未注册 跳转到注册页
        **/
        wx.redirectTo({
          url: '/pages/login/login'
        })
        return;
      } else if (res.data.code != 1) {
        wx.showToast({
          title: res.data.msg || "服务器异常",
          icon: 'none'
        })
        return;
      }
      //成功
      callback(res);
    },
    fail: function (err) {
      wx.showToast({
        title: err.errMsg || "链接服务器失败",
        icon: 'none'
      })
      // errFun(err);
    }
  })
}

module.exports = {
  formatTime, checkPhone, checkName, wxRequest
}
