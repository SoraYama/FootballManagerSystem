import config from '../../config.js'
const app = getApp()

Page({
  data: {
    refereeId: "",
    info: null,
  },
  onLoad: function (query) {
    console.log(query)
    this.setData({
      refereeId: query.query,
    })
    wx.showLoading(config.loadingToast)
    wx.request({
      url: config.queryRefereeById,
      method: "POST",
      data: {
        refereeId: this.data.refereeId,
      },
      success: res => {
        console.log("query referee data: ", res.data)
        wx.hideLoading()
        wx.showToast(config.successToast)
        this.setData({
          info: res.data,
        })
      },
      fail: err => {
        console.log("query referee FAILED! Error: ", err)
        wx.showModal({
          title: '载入失败',
          content: '网络不稳定，请重新加载',
          showCancel: false,
        })
      }
    })
  },
})
