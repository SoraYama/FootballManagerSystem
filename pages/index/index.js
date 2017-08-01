//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    gameName: "",
    gameDate: "",
    gameTime: "",
    refereeNumber: 0,
    submitResponse: ""
  },

  bindGameName: function(e) {
    this.setData({
      gameName: e.detail.value
    })
  },

  bindDateChange: function(e) {
    this.setData({
      gameDate: e.detail.value
    })
  },

  bindTimeChange: function(e) {
    this.setData({
      gameTime: e.detail.value
    })
  },

  bindRefereeNumber: function(e) {
    this.setData({
      refereeNumber: e.detail.value
    })
  },

  formSubmit: function(e) {
    var that = this
    console.log("formData: ", e.detail.value)
    wx.request({
      url: util.SERVERURL,
      data: {
        formData: e.detail.value,
      },
      method: 'GET', 
      success: function(res){
        that.setData({
          submitResponse: res,
        })
        console.log("success", res)
      },

      fail: function() {
        console.log("FAILED!")
      }
    })
  }

})
