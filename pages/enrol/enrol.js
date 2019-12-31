// enrol.js
import util from "../../utils/util.js";
import config from "../../config.js";

let app = getApp();
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
    assignedRefereeNum: null,

    checkboxItems: [
      // {name: 'standard is dealt for u.', value: '0', checked: true},
      // {name: 'standard is dealicient for u.', value: '1'}
    ]
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
    console.log("*** query: ", query);
    console.debug("*** global data in enrol.js", app.globalData);
    const myName =
      (app.globalData.myInfo && app.globalData.myInfo.refereeName) || "";
    console.log("*** my name: ", myName);
    this.setData({
      colId: query.colId,
      cancel: query.cancel || false,
      update: query.update || false,
      own: query.own || false,
      myName
    });
    wx.showLoading(config.loadingToast);
    this.getGameData();
  },

  getGameData() {
    wx.request({
      ...config.queryById,
      data: {
        gameId: this.data.colId
      },
      success: data => {
        console.log("query game: ", data);
        wx.hideLoading();
        let _refereeNames =
          data.data.data.referees &&
          data.data.data.referees
            .filter(r => r.assigned)
            .map(r => r.refereeName)
            .join(", ");
        let checks = data.data.data.gameAvailablePeriod.map((t, i) => {
          return {
            checked: false,
            value: i,
            name: t
          };
        });
        const { gameStartTime, gameEndTime } = data.data.data;
        const toVisible = {
          ...data.data.data,
          gameStartTime: new Date(gameStartTime).toLocaleString(),
          gameEndTime: new Date(gameEndTime).toLocaleString()
        };
        this.setData({
          game: toVisible,
          refereeNames: _refereeNames,
          checkboxItems: checks,
          assignedRefereeNum: data.data.data.referees
            ? data.data.data.referees.filter(r => r.assigned).length
            : 0
        });
        console.log("*** enrol data.checkboxitems: ", this.data.checkboxItems);
      },
      fail: err => {
        console.error("query game error!", err);
        wx.showModal({
          title: "加载失败",
          content: "网络不稳定，请刷新",
          showCancel: false
        });
      }
    });
  },

  bindRefereeNameChange: function(e) {
    this.setData({
      myName: e.detail.value
    });
  },

  checkboxChange: function(e) {
    console.log("*** checkbox e ", e.detail.value);
    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].name == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
    this.setData({
      availablePeriod: this.data.game.gameAvailablePeriod.filter(
        (e, i) => this.data.checkboxItems.indexOf(i) >= 0
      )
    });
  },

  formSubmit: function(e) {
    let that = this;
    if (!that.data.myName) {
      that.showTopTips();
      return;
    }

    console.log("enrol formData: ", e.detail.value);
    wx.showLoading(config.loadingToast);
    let data = e.detail.value;

    const networkConfig = that.data.update ? config.updateEnrol : config.enrol;

    wx.request({
      ...networkConfig,
      data: {
        gameId: this.data.colId,
        availablePeriod: data.availablePeriod,
        refereeName: data.refereeName
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.status !== 0) {
          wx.showModal({
            title: "提交失败",
            content: res.data.msg,
            showCancel: false
          });
        } else {
          console.log("success", res);
          wx.showToast(config.successToast);
          setTimeout(wx.navigateBack, config.successToast.duration);
        }
      },

      fail: function() {
        console.log("ENROL FAILED!");
        wx.hideLoading();
        wx.showModal({
          title: "提交失败",
          content: "网络不稳定，请重新提交",
          showCancel: false
        });
      }
    });
  },

  cancelEnrol: function(e) {
    let that = this;
    wx.showLoading(config.loadingToast);
    wx.request({
      ...config.cancelEnrol,
      data: {
        gameId: that.data.colId
      },
      success: data => {
        console.log("cancel enrol success: ", data);
        wx.hideLoading();
        wx.showToast(config.loadingToast);
        setTimeout(wx.navigateBack, config.successToast.duration);
      },
      failed: err => {
        wx.hideLoading();
        console.error("cancel enrol failed: ", err);
      }
    });
  },

  /** 选派 */
  assign: function(e) {
    let that = this;
    console.log("assign event", e);
    const { id, iscancle = false } = e.target.dataset;
    wx.showLoading(config.loadingToast);
    console.log("*** game: ", that.data.game);
    let referee = that.data.game.referees
      .filter(r => r.referee._id === id)
      .shift();
    console.log("assign var: ", referee);
    wx.request({
      ...config.assign,
      data: {
        refereeId: id,
        gameId: that.data.game._id,
        assigned: iscancle ? false : true
      },
      success: function(res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.status !== 0) {
          wx.showModal({
            title: "选派失败",
            content: "请重新尝试",
            showCancel: false
          });
          return;
        }
        wx.showToast(config.successToast);
        // that.getGameData();
        const referees = [...that.data.game.referees];
        const updatedReferee = referees.find(r => r.referee._id === id);
        console.log(",", updatedReferee);
        const index = referees.indexOf(updatedReferee);
        referees.splice(index, 1, {
          ...updatedReferee,
          assigned: !iscancle
        });
        that.setData({
          game: {
            ...that.data.game,
            referees
          }
        });
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showModal({
          title: "选派失败",
          content: "请重新尝试",
          showCancel: false
        });
      }
    });
  },

  onDeleteGame: function(e) {
    wx.showModal({
      title: "请确认",
      content: "您确定要删除该比赛吗？",
      success: res => {
        res.confirm ? this.deleteGame() : null;
      }
    });
  },

  deleteGame: function() {
    wx.showLoading(config.loadingToast);
    console.log("*** data.game: ", this.data.game);
    wx.request({
      ...config.deleteGame,
      data: {
        gameId: this.data.game._id
      },
      success: function(res) {
        console.log("delete game success, res: ", res);
        wx.hideLoading();
        wx.showToast(config.successToast);
        setTimeout(wx.navigateBack, config.successToast.duration);
      }
    });
  },

  /** 转发 */
  onShareAppMessage: function(res) {
    return {
      title: `赛事报名-${this.data.game.gameName}`,
      path: `/pages/enrol/enrol?colId=${this.data.colId}`,
      success: function(res) {
        console.log("share success, res: ", res);
      }
    };
  }
});
