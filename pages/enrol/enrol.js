// enrol.js
import util from '../../utils/util.js'
import config from '../../config.js'

let app = getApp()
Page({
  data: {
    colId: null,
    game: null,
    startRefTime: "00:00",
    endRefTime: "23:59",
    refereeName: "",
  },
  onLoad: function(query) {
    console.log(' *** query: ', query);
    this.setData({
      colId: query.colId,
    })
    wx.showLoading({
      title: 'Loading',
    })
    wx.request({
      url: config.queryById,
      method: 'POST',
      data: {
        colId: this.data.colId,
      },
      success: data => {
        console.log('query game: ', data);
        wx.hideLoading();
        this.setData({
          game: data.data,
        });
      },
      fail: err => {
        console.error('query game error!', err);
        wx.showToast({
          title: 'Failed!',
        })
      }
    })
  },
  bindRefereeNameChange: function(e) {
    this.setData({
      refereeName: e.detail.value,
    })
  },
  bindEndRefTimeChange: function(e) {
    this.setData({
      endRefTime: e.detail.value,
    })
  },
  bindStartRefTimeChange: function(e) {
    this.setData({
      startRefTime: e.detail.value,
    })
  },
  formSubmit: function(e) {
    let that = this
    console.log("enrol formData: ", e.detail.value)
    wx.showLoading({
      title: 'Waiting',
      mask: true
    })
    let data = e.detail.value
    data['openid'] = app.globalData.openid
    data['gameId'] = this.data.colId
    wx.request({
      url: config.enrol,
      data: {
        data: data,
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()
        if (res.statusCode !== 200) {
          wx.showModal({
            title: '提交失败',
            content: res.data.msg,
            showCancel: false,
          })
        } else {
          wx.showToast({
            title: '报名成功',
            duration: 2000,
          })
        }
        console.log("success", res)
      },

      fail: function() {
        console.log("ENROL FAILED!")
        wx.showModal({
          title: '提交失败',
          content: '网络不稳定，请重新提交',
          showCancel: false,
        })
      }
    })
  }
})
