// enrol.js
import util from '../../utils/util.js'
import config from '../../config.js'

let app = getApp()
Page({
  data: {
    showTopTips: false,
    colId: null,
    game: null,
    cancel: false,
    update: false,
    startRefTime: "00:00",
    endRefTime: "23:59",
    refereeName: "",
  },

  showTopTips: function() {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  onLoad: function(query) {
    console.log('*** query: ', query);
    this.setData({
      colId: query.colId,
      cancel: query.cancel,
      update: query.update,
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
    if (!that.data.refereeName) {
      that.showTopTips()
      return
    }

    console.log("enrol formData: ", e.detail.value)
    wx.showLoading({
      title: 'Waiting',
      mask: true
    })
    let data = e.detail.value
    data['openid'] = app.globalData.openid
    data['gameId'] = this.data.colId

    const URL = that.data.update ? config.updateEnrol : config.enrol

    wx.request({
      url: URL,
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
            title: 'success',
            duration: 2000,
          })
          wx.navigateBack()
        }
        console.log("success", res)
      },

      fail: function() {
        console.log("ENROL FAILED!")
        wx.hideLoading()
        wx.showModal({
          title: '提交失败',
          content: '网络不稳定，请重新提交',
          showCancel: false,
        })
      }
    })
  }, 

  cancelEnrol: function(e) {
    let that = this
    wx.showLoading({
      title: 'Waiting'
    })
    wx.request({
      url: config.cancelEnrol,
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        gameId: that.data.colId,
      },
      success: data => {
        console.log('cancel enrol success: ', data)
        wx.hideLoading()
        wx.showToast({
          title: 'success',
          icon: 'success',
        })
        wx.navigateBack()
      }, 
      failed: err => {
        wx.hideLoading()
        console.error('cancel enrol failed: ', err)
      },
    })
  }
})
