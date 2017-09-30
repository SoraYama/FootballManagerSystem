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
      method: 'GET',
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
    wx.request({
      url: config.enrol,
      data: {
        formData: e.detail.value,
        openid: app.globalData.openid,
      },
      method: 'GET',
      success: function(res) {
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
