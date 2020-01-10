//creategame.js
import util from "../../utils/util.js";
import config from "../../config.js";
import network from "../../lib/network.js";
const app = getApp();
Page({
  data: {
    gameName: "",
    gameDate: `${new Date().getFullYear()}-${new Date().getMonth() +
      1}-${new Date().getDate()}`,
    gameTime: "00:00",
    gameEndTime: "23:59",
    gamePublisherName: "",
    gameAvailablePeriod: "",
    refereeNumber: null,
    submitResponse: "",
    showTopTips: false,
    isAdmin: false,
    isLogin: false
  },

  onShow() {
    this.setData({
      isAdmin: app.globalData.isAdmin,
      isLogin: !!app.globalData.id
    });
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

  goLogin(e) {
    console.log(e);
  },

  bindGameName: function(e) {
    this.setData({
      gameName: e.detail.value
    });
  },

  bindGamePublisher: function(e) {
    this.setData({
      gamePublisherName: e.detail.value
    });
  },

  bindDateChange: function(e) {
    this.setData({
      gameDate: e.detail.value
    });
  },

  bindTimeChange: function(e) {
    this.setData({
      gameTime: e.detail.value
    });
  },

  bindEndTimeChange: function(e) {
    this.setData({
      gameEndTime: e.detail.value
    });
  },

  bindRefereeNumber: function(e) {
    this.setData({
      refereeNumber: e.detail.value
    });
  },

  bindAvailablePeriod: function(e) {
    this.setData({
      gameAvailablePeriod: e.detail.value
    });
  },

  formSubmit: function(e) {
    if (!this.data.gameName || !this.data.refereeNumber) {
      this.showTopTips();
      return;
    }

    var that = this;
    console.debug("*** target.value", e.detail.value);
    let formData = e.detail.value;
    let available_period = this.data.gameAvailablePeriod.split(/\s+/g);
    formData = {
      ...formData,
      gameStartTime: new Date(
        `${formData.gameDate} ${formData.gameTime}`
      ).getTime(),
      gameEndTime: new Date(
        `${formData.gameDate} ${formData.gameEndTime}`
      ).getTime(),
      requiredRefereeAmount: +formData.refereeNumber,
      gameAvailablePeriod: available_period
    };
    console.debug("*** formData: ", formData);
    network.request(
      config.createGame.url,
      {
        ...formData
      },
      { method: "POST" }
    );
  }
});
