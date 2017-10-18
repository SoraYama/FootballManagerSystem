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
    tabs: ['现有比赛', '我发布的', '我报名的'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
  },
  onShow: function() {
    wx.startPullDownRefresh();
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

  getGameData: function() {
    let that = this

    wx.showLoading({
      title: 'waiting',
    })

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
      },
      failed: err => {
        console.error('get games err: ', err)
      }
    })
  },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });
  },
  
  onPullDownRefresh: function() {
    this.getGameData();
  }
})
