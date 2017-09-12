//myGame0.js
var util = require('../../utils/util.js')
let app = getApp()
Page({
  data: {
    games: 0,
  },
  onLoad: function () {
    app.getUserOpenId((err, openId) => {
      if (err) {
        console.error('Error', err)
      } else {
        console.log('openId: ', openId)
        this.setData({
          games: openId
        })
      }
    })
  }
})
