//logs.js
var util = require('../../utils/util.js')
let app = getApp()
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    app.getUserInfo(UserInfo => {
      this.setData({
        logs: (wx.getStorageSync('logs') || []).map(log => util.formatTime(new Date(log))),
        UserInfo: UserInfo.nickName,
      })
      console.log("UserInfo: ", UserInfo)
    })
  }
})
