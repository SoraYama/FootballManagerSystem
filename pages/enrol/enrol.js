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

    refereeNames: "",
    myName: "",

    checkboxItems: [
      // {name: 'standard is dealt for u.', value: '0', checked: true},
      // {name: 'standard is dealicient for u.', value: '1'}
    ],
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

  onLoad: function (query) {
    console.log('*** query: ', query);
    const myName = app.globalData.myInfo && app.globalData.myInfo.refereeName
    console.log("*** my name: ", myName)
    this.setData({
      colId: query.colId,
      cancel: query.cancel,
      update: query.update,
      own: query.own,
      myName: myName,
    })
    wx.showLoading(config.loadingToast)
    this.getGameData()
  },

  getGameData() {
    wx.request({
      url: config.queryById,
      method: 'POST',
      data: {
        colId: this.data.colId,
      },
      success: data => {
        console.log('query game: ', data);
        wx.hideLoading()
        let _refereeNames = data.data.referees && data.data.referees.filter(r => r.assigned).map(r => r.refereeName).join(", ")
        let checks = data.data.gameAvailablePeriod.map((t, i) => {
          return {
            checked: false,
            value: i,
            name: t,
          };
        })
        this.setData({
          game: data.data,
          refereeNames: _refereeNames,
          checkboxItems: checks,
        });
        console.log('*** enrol data.checkboxitems: ', this.data.checkboxItems)
      },
      fail: err => {
        console.error('query game error!', err);
        wx.showModal({
          title: '加载失败',
          content: '网络不稳定，请刷新',
          showCancel: false,
        })
      }
    })
  },

  bindRefereeNameChange: function (e) {
    this.setData({
      myName: e.detail.value,
    })
  },

  checkboxChange: function (e) {
    console.log('*** checkbox e ', e.detail.value)
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems,
    })
    this.setData({
      availablePeriod: this.data.game.gameAvailablePeriod.filter((e, i) => this.data.checkboxItems.indexOf(i) >= 0),
    })
  },

  formSubmit: function (e) {
    let that = this
    if (!that.data.myName) {
      that.showTopTips()
      return
    }

    console.log("enrol formData: ", e.detail.value)
    wx.showLoading(config.loadingToast)
    let data = e.detail.value
    data['openid'] = app.globalData.openid
    data['gameId'] = this.data.colId
    data['userInfo'] = app.globalData.userInfo
    data['availablePeriod'] = this.data.availablePeriod

    const URL = that.data.update ? config.updateEnrol : config.enrol

    wx.request({
      url: URL,
      data: {
        data: data,
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode !== 200) {
          wx.showModal({
            title: '提交失败',
            content: res.data.msg,
            showCancel: false,
          })
        } else {
          wx.showToast(config.successToast)
          setTimeout(wx.navigateBack, config.successToast.duration)
        }
        console.log("success", res)
      },

      fail: function () {
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

  cancelEnrol: function (e) {
    let that = this
    wx.showLoading(config.loadingToast)
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
        wx.showToast(config.loadingToast)
        setTimeout(wx.navigateBack, config.successToast.duration);
      },
      failed: err => {
        wx.hideLoading()
        console.error('cancel enrol failed: ', err)
      },
    })
  },

  /** 选派 */
  assign: function (e) {
    let that = this
    console.log('assign event', e)
    let openid = e.target.dataset.openid
    wx.showLoading(config.loadingToast)
    console.log('*** game: ', that.data.game)
    let referee = that.data.game.referees.filter(r => r.openid === openid).shift()
    if (!referee.assigned) referee["assigned"] = false;
    console.log("assign var: ", referee);
    wx.request({
      url: config.assign,
      method: "POST",
      data: {
        openid: openid,
        gameId: that.data.game._id,
        assign: referee.assigned,
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast(config.successToast)
        that.getGameData()
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showModal({
          title: '选派失败',
          content: err.data,
          showCancel: false,
        })
      }
    })
  },

  onDeleteGame: function (e) {
    wx.showModal({
      title: '请确认',
      content: '您确定要删除该比赛吗？',
      success: (res) => {
        res.confirm ? this.deleteGame() : null
      }
    })
  },

  deleteGame: function () {
    wx.showLoading(config.loadingToast)
    console.log('*** data.game: ', this.data.game)
    wx.request({
      url: config.deleteGame,
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        gameId: this.data.game._id,
      },
      success: function (res) {
        console.log('delete game success, res: ', res);
        wx.hideLoading();
        wx.showToast(config.successToast);
        setTimeout(wx.navigateBack, config.successToast.duration);
      }
    })
  },

  /** 转发 */
  onShareAppMessage: function (res) {
    return {
      title: `赛事报名-${this.data.game.gameName}`,
      path: `/pages/enrol/enrol?colId=${this.data.colId}`,
      success: function (res) {
        console.log('share success, res: ', res);
      }
    }
  },
})
