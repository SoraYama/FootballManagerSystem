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
        let interval = null
        if (!app.globalData.id) {
          interval = setInterval(() => {
            if (app.globalData.id) {
              that.getGameData()
              clearInterval(interval)
            }
          }, 1000);
        } else {
          that.getGameData()
        }
      }
    })
  },

  getGameData: function () {
    let that = this

    wx.showLoading(config.loadingToast)

    wx.request({
      ...config.getAllGames,
      success: resp => {

        wx.hideLoading()

        let gameData = resp.data.data
        console.log('*** incoming data from all games: ', resp.data)
        that.setData({
          availableGames: gameData.availableGames,
          myEnroledGames: gameData.myEnroledGames,
          myCreatedGames: gameData.myCreatedGames,
        })

        wx.stopPullDownRefresh()
        that.setCurrentArr(null)
      },
      failed: err => {
        wx.hideLoading()
        console.error('get games err: ', err)
      }
    })
  },

  setCurrentArr: function (nameStr) {
    let gameArr = null;

    console.debug("*** this.data: ", this.data)
    gameArr = (this.data.activeIndex === "0" || this.data.activeIndex === 0) ? this.data.availableGames : (this.data.activeIndex === "1" ? this.data.myCreatedGames : this.data.myEnroledGames)
    console.debug("*** this.data.activeindex: ", this.data.activeIndex)
    console.debug("*** after switch: ", gameArr)
    let filtered = [];
    if(gameArr) {
      filtered = gameArr.filter(e => {
        if (!nameStr) { return true }
        return e.gameName.indexOf(nameStr) >= 0 || e.gamePublisher.indexOf(nameStr) >= 0
      })
    }

    filtered.sort((a, b) => {
      console.debug("*** a: ", a)
      return new Date(b.gameStartTime) - new Date(a.gameStartTime)
    })

    if (filtered.length > 0 && (this.data.activeIndex === "2" || this.data.activeIndex === 2)) {
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].referees) {
          filtered[i].assigned = filtered[i].referees.filter(r => r.openid === app.globalData.openid && r.assigned).length > 0
        }
      }
    }

    filtered = filtered.map(i => ({
      ...i,
      gameStartTime: new Date(i.gameStartTime).toLocaleString(),
      gameEndTime: new Date(i.gameEndTime).toLocaleString(),
      expired: new Date(i.gameStartTime) < Date.now(),
    }))

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
