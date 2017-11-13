//myGame.js
import util from '../../utils/util.js'
import config from '../../config.js'
const sliderWidth = 96;
let app = getApp()
Page({
  data: {
    availableGames: [],
    myEnroledGames: [],
    myCreatedGames: [],

    filteredGames: [],

    tabs: ['现有比赛', '我发布的', '我报名的'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    inputShowed: false,
    inputVal: "",
  },
  onShow: function () {
    this.getGameData()
  },
  onLoad: function () {
    let that = this;

    wx.getSystemInfo({
      success: res => {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
        that.getGameData();
      }
    });
  },

  getGameData: function () {
    let that = this

    wx.showLoading(config.loadingToast)

    wx.request({
      url: config.getAllGamesUrl,
      data: {
        openid: app.globalData.openid,
      },
      method: 'POST',
      success: data => {

        wx.hideLoading()

        let gameData = data.data
        console.log('*** incoming data from all games: ', data)
        that.setData({
          availableGames: gameData.availableGames,
          myEnroledGames: gameData.myEnroledGames,
          myCreatedGames: gameData.myCreatedGames,
        })

        wx.stopPullDownRefresh()
        that.setCurrentArr(null)
      },
      failed: err => {
        console.error('get games err: ', err)
      }
    })
  },

  setCurrentArr: function (nameStr) {
    let gameArr = null;

    console.debug("*** this.data: ", this.data)
    gameArr = this.data.activeIndex === "0" ? this.data.availableGames : (this.data.activeIndex === "1" ? this.data.myCreatedGames : this.data.myEnroledGames)
    console.debug("*** this.data.activeindex: ", this.data.activeIndex)
    console.debug("*** after switch: ", gameArr)
    const filtered = gameArr.filter(e => {
      if (!nameStr) { return true }
      return e.gameName.indexOf(nameStr) >= 0
    })
    console.debug("*** after filter: ", filtered)
    this.setData({
      filteredGames: filtered,
    })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });
    this.setCurrentArr(null)
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.setCurrentArr(e.detail.value)
  },

  onPullDownRefresh: function () {
    this.getGameData()
  }
})
