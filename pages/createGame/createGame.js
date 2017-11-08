//creategame.js
import util from '../../utils/util.js'
import config from '../../config.js'
const app = getApp()
Page({
  data: {
    gameName: "",
    gameDate: "2017-01-01",
    gameTime: "00:00",
    gameEndTime: "23:59",
    gamePublisher: "",
    refereeNumber: null,
    submitResponse: "",
    showTopTips: false,
  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  bindGameName: function (e) {
    this.setData({
      gameName: e.detail.value
    })
  },

  bindGamePublisher: function (e) {
    this.setData({
      gamePublisher: e.detail.value,
    })
  },

  bindDateChange: function (e) {
    this.setData({
      gameDate: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    this.setData({
      gameTime: e.detail.value
    })
  },

  bindEndTimeChange: function (e) {
    this.setData({
      gameEndTime: e.detail.value
    })
  },

  bindRefereeNumber: function (e) {
    this.setData({
      refereeNumber: e.detail.value
    })
  },

  formSubmit: function (e) {
    if (!this.data.gameName || !this.data.refereeNumber || !this.data.gamePublisher) {
      this.showTopTips()
      return
    }

    var that = this
    let formData = e.detail.value
    formData['openid'] = app.globalData.openid
    formData['publisherAvatar'] = app.globalData.userInfo.avatarUrl
    console.log('*********', formData['publisherAvatar'])
    console.log("formData: ", formData)
    wx.showLoading(config.loadingToast)
    wx.request({
      url: config.createGame,
      data: {
        formData: formData,
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        wx.showToast(config.successToast)
        console.log("success", res)
      },

      fail: function () {
        console.log("CREATE GAME FAILED!")
        wx.showModal({
          title: '提交失败',
          content: '网络不稳定，请重新提交',
          showCancel: false,
        })
      }
    })
  }
})
