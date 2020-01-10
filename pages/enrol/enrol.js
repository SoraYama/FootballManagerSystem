// enrol.js
import util from "../../utils/util.js";
import config from "../../config.js";
import network from "../../lib/network.js";

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
    console.debug("*** query: ", query);
    console.debug("*** global data in enrol.js", app.globalData);
    const myName =
      (app.globalData.myInfo && app.globalData.myInfo.refereeName) || "";
    console.debug("*** my name: ", myName);
    this.setData({
      colId: query.colId,
      cancel: query.cancel || false,
      update: query.update || false,
      own: query.own || false,
      myName
    });
    this.getGameData();
  },

  getGameData() {
    network
      .request(config.queryById.url, {
        gameId: this.data.colId
      })
      .then(data => {
        let _refereeNames =
          data.data.referees &&
          data.data.referees
            .filter(r => r.assigned)
            .map(r => r.refereeName)
            .join(", ");
        let checks = data.data.gameAvailablePeriod.map((t, i) => {
          return {
            checked: false,
            value: i,
            name: t
          };
        });
        const { gameStartTime, gameEndTime } = data.data;
        const toVisible = {
          ...data.data,
          gameStartTime: new Date(gameStartTime).toLocaleString(),
          gameEndTime: new Date(gameEndTime).toLocaleString()
        };
        this.setData({
          game: toVisible,
          refereeNames: _refereeNames,
          checkboxItems: checks,
          assignedRefereeNum: data.data.referees
            ? data.data.referees.filter(r => r.assigned).length
            : 0
        });
        console.debug(
          "*** enrol data.checkboxitems: ",
          this.data.checkboxItems
        );
      });
  },

  bindRefereeNameChange: function(e) {
    this.setData({
      myName: e.detail.value
    });
  },

  checkboxChange: function(e) {
    console.debug("*** checkbox e ", e.detail.value);
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

    console.debug("enrol formData: ", e.detail.value);
    wx.showLoading(config.loadingToast);
    let data = e.detail.value;

    const networkConfig = that.data.update ? config.updateEnrol : config.enrol;

    network
      .request(
        networkConfig.url,
        {
          gameId: this.data.colId,
          availablePeriod: data.availablePeriod,
          refereeName: data.refereeName
        },
        { method: networkConfig.method }
      )
      .then(data => {
        console.debug("success", res);

        setTimeout(wx.navigateBack, config.successToast.duration);
      });
  },

  cancelEnrol: function(e) {
    let that = this;

    network
      .request(
        config.cancelEnrol.url,
        { gameId: that.data.colId },
        { method: config.cancelEnrol.method }
      )
      .then(data => {
        console.debug("cancel enrol success: ", data);
        setTimeout(wx.navigateBack, config.successToast.duration);
      });
  },

  /** 选派 */
  assign: function(e) {
    let that = this;
    console.debug("assign event", e);
    const { id, iscancle = false } = e.target.dataset;
    console.debug("*** game: ", that.data.game);
    let referee = that.data.game.referees
      .filter(r => r.referee._id === id)
      .shift();
    console.debug("assign var: ", referee);
    network
      .request(
        config.assign.url,
        {
          refereeId: id,
          gameId: that.data.game._id,
          assigned: iscancle ? false : true
        },
        { method: config.assign.method }
      )
      .then(() => {
        wx.showToast(config.successToast);
        const referees = [...that.data.game.referees];
        const updatedReferee = referees.find(r => r.referee._id === id);
        console.debug("updatedReferee,", updatedReferee);
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
    console.debug("*** data.game: ", this.data.game);
    const { url, method } = config.deleteGame;
    network
      .request(
        url,
        {
          gameId: this.data.game._id
        },
        { method }
      )
      .then(res => {
        console.debug("delete game success, res: ", res);
        wx.showToast(config.successToast);
        setTimeout(wx.navigateBack, config.successToast.duration);
      });
  },

  /** 转发 */
  onShareAppMessage: function(res) {
    return {
      title: `赛事报名-${this.data.game.gameName}`,
      path: `/pages/enrol/enrol?colId=${this.data.colId}`,
      success: function(res) {
        console.debug("share success, res: ", res);
      }
    };
  }
});
