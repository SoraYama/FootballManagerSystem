//myGame.js
import util from '../../utils/util.js'
import config from '../../config.js'
let app = getApp()
Page({
  data: {
    games: [],
  },
  onLoad: function () {
    wx.request({
      url: config.getAllGamesUrl,
      data: {
        openid: app.globalData.openid,
      },
      method: 'POST',
      success: data => {
        data = data.data
        console.log('*** incoming data from all games: ', data)
        this.setData({
          games: data,
        })
      }
    })
  }
})
