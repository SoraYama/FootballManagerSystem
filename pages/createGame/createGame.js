//creategame.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    gameName: "",
    gameDate: "2017-01-01",
    gameTime: "00:00",
    gameEndTime: "23:59",
    refereeNumber: null,
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

  bindEndTimeChange: function(e) {
    this.setData({
      gameEndTime: e.detail.value
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
    wx.showLoading({
      title: 'Waiting',
      mask: true
    })
    wx.request({
      url: util.SERVERURL + '/creategame',
      data: {
        formData: e.detail.value,
        openid: app.globalData.openid,
      },
      method: 'GET',
      success: function(res){
        wx.hideLoading()
        wx.showToast({
          icon: 'success',
          title: 'Success',
          duration: 2000,
        })
        that.setData({
          submitResponse: res,

        })
        console.log("success", res)
      },

      fail: function() {
        console.log("CREATE GAME FAILED!")
        wx.showToast({
          title: 'Failed',
        })
      }
    })
  }

})
