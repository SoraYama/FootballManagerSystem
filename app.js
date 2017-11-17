//app.js
import config from './config.js'

App({
  onLaunch: function() {
    this.getUserInfo((userInfo) => {
      this.globalData.userInfo = userInfo
      this.getUserOpenId((err, openid) => {
        if (err) {
          console.error('Error', err)
        } else {
          console.log('openid: ', openid)
          this.globalData.openid = openid;
        }
      });
    })
  },

  getUserInfo: function(cb) {
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: (res) => {
          this.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(this.globalData.userInfo)
        }
      })
    }
  },

  getUserOpenId: function(callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function(data) {
          console.log('*** login data: ', data)
          wx.showLoading(config.loadingToast)
          if (data.code) {
            wx.request({
              url: config.openIdUrl,
              data: {
                code: data.code,
                userInfo: self.globalData.userInfo
              },
              method: 'POST',
              success: function(res) {
                wx.hideLoading()
                console.log('拉取openid成功', res)
                self.globalData.openid = res.data.openid
                self.globalData.isAdmin = res.data.isAdmin
                console.log(self.globalData)
                callback(null, self.globalData.openid)
              },
              fail: function(res) {
                console.error('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                callback(res)
              }
            })
          }
        },
        fail: function(err) {
          console.error('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    openid: null,
    myInfo: null,
    isAdmin: false,
  }
})
