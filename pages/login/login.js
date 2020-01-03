// pages/login.js
import config from '../../config.js';

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginBtnVis: false,
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const self = this
    wx.showLoading(config.loadingToast);
    wx.getSetting({
      success(res) {
        wx.hideLoading();
        if (res.authSetting["scope.userInfo"]) {
          self.getUserInfo();
        } else {
          self.setData({
            loginBtnVis: true,
          })
        }
      },
      fail(err) {
        wx.hideLoading();
        console.error(err);
      }
    })
  },

  goToIndex() {
    wx.switchTab({
      url: '/pages/myGame/myGame',
    })
  },

  bindGetUserInfo(e) {
    const info = e.detail
    if (info.errMsg !== 'getUserInfo:ok') {
      return;
    }
    this.setSession(info);
  },
 
  getUserInfo() {
    wx.getUserInfo({
      withCredentials: true,
      success: res => {
        console.log("userInfo res", res);
        app.globalData.userInfo = res.userInfo;
        this.setSession(res)
      },
      fail: e => {
        wx.hideLoading();
        wx.showModal({
          title: '身份认证失败',
        })
        console.error(e);
      }
    });
  },

  setSession(userInfoData) {
    const { rawData, signature, userInfo } = userInfoData;
    var self = this;
    wx.login({
      success: function (data) {
        console.log("*** login data: ", data);
        if (data.code) {
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
            success: function (res) {
              wx.hideLoading();
              console.log("登录成功", res);
              app.globalData.isAdmin = res.data.data.isAdmin;
              app.globalData.id = res.data.data.id;
              console.log("global data ->", self.globalData);
              self.goToIndex()
            },
            fail: function (err) {
              wx.hideLoading();
              wx.showModal({
                title: '登录失败',
                content: '请检查网络，稍后再试',
              })
              console.error("网络错误", err);
            }
          });
        }
      },
      fail: function (err) {
        console.error(
          "wx.login 接口调用失败，将无法正常使用开放接口等服务",
          err
        );
      }
    });
  },
})