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
    own: false,
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
      own: query.own,
    })
    wx.showLoading({
      title: 'Loading',
      icon: 'Loading',
    })
    wx.request({
      url: config.queryById,
      method: 'POST',
      data: {
        colId: this.data.colId,
      },
      success: data => {
        console.log('query game: ', data);
        wx.hideLoading()
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
            duration: config.toastDuration,
          })
          setTimeout(wx.navigateBack, config.toastDuration);
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
          duration: config.toastDuration,
        })
        setTimeout(wx.navigateBack, config.toastDuration);
      }, 
      failed: err => {
        wx.hideLoading()
        console.error('cancel enrol failed: ', err)
      },
    })
  },

  /** 选派 */
  assign: function(e) {
    let that = this
    console.log('assign', e)
    let openid = e.target.dataset.openid;
    wx.showLoading()
    let assign = that.data.game.referees.filter(r => r.openid === openid).shift().assign
    wx.request({
      url: config.assign,
      method: "POST",
      data: {
        openid: openid,
        gameId: that.data.game._id,
        assign: !assign,
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: 'success',
          icon: 'success',
          duration: config.toastDuration,
        })
        setTimeout(wx.navigateBack, config.toastDuration);
      },
      fail: function(err) {
        wx.hideLoading()
        wx.showModal({
          title: '选派失败',
          content: err.data,
          showCancel: false,
        })
      }
    })
  },

  onDeleteGame: function(e) {
    wx.showModal({
      title: '请确认',
      content: '您确定要删除该比赛吗？',
      success: this.deleteGame,
    })
  },

  deleteGame: function() {
    wx.showLoading({
      title: 'Loading',
    })
    console.log('*** data.game: ', this.data.game)
    wx.request({
      url: config.deleteGame,
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        gameId: this.data.game._id,
      },
      success: function(res) {
        console.log('delete game success, res: ', res);
        wx.hideLoading();
        wx.showToast({
          title: 'success',
          duration: config.toastDuration,
        });
        setTimeout(wx.navigateBack, config.toastDuration);
      }
    })
  },

  /** 转发 */
  onShareAppMessage: function(res) {
    return {
      title: `赛事报名-${this.data.game.gameName}`,
      path: `/pages/enrol/enrol?colId=${this.data.colId}`,
      success: function(res) {
        console.log('share success, res: ', res);
      }
    }
  },
})
