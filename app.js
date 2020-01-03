import "./vendor/weapp-cookie/dist/weapp-cookie";
import config from "./config.js";

App({
  onLaunch: function() {
    this.setSession(err => {
      err && console.error("setSession error", err);
    });
  },

  getUserInfo: function(cb) {
    // if (this.globalData.userInfo) {
    //   typeof cb == "function" && cb({})
    // } else {
    const getUserInfo = () => {
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          console.log("userInfo res", res);
          this.globalData.userInfo = res.userInfo;
          typeof cb == "function" && cb(res);
        },
        fail: e => {
          console.error(e);
        }
      });
    };
    // 调用登录接口
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.userInfo"]) {
          wx.authorize({
            scope: "scope.userInfo",
            success(r) {
              getUserInfo();
            },
            fail(e) {
              console.error(e)
            }
          });
        } else {
          getUserInfo();
        }
      },
      fail(err) {
        console.error(err)
      }
    });

    // }
  },

  setSession: function(callback) {
    var self = this;
    wx.login({
      success: function(data) {
        console.log("*** login data: ", data);
        if (data.code) {
          self.getUserInfo(({ rawData, signature, userInfo }) => {
            wx.request({
              ...config.login,
              data: {
                code: data.code,
                userInfo,
                identity: {
                  rawData,
                  signature
                }
              },
              success: function(res) {
                wx.hideLoading();
                console.log("登录成功", res);
                self.globalData.isAdmin = res.data.data.isAdmin;
                self.globalData.id = res.data.data.id;
                console.log("global data ->", self.globalData);
                callback(null);
              },
              fail: function(err) {
                console.error("拉取用户信息失败，将无法正常使用开放接口等服务");
                callback(err);
              }
            });
          });
        }
      },
      fail: function(err) {
        console.error(
          "wx.login 接口调用失败，将无法正常使用开放接口等服务",
          err
        );
        callback(err);
      }
    });
  },

  globalData: {
    id: null,
    userInfo: null,
    isAdmin: false
  }
});
