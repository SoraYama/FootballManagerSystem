import config from "../../config.js";
const app = getApp();

Page({
  data: {
    refereeId: "",
    info: null
  },
  onLoad: function(query) {
    console.debug(query);
    this.setData({
      refereeId: query.query
    });
    wx.showLoading(config.loadingToast);
    wx.request({
      ...config.queryRefereeById,
      data: {
        refereeId: this.data.refereeId
      },
      success: res => {
        console.debug("query referee data: ", res.data);
        wx.hideLoading();
        this.setData({
          info: res.data
        });
      },
      fail: err => {
        console.debug("query referee FAILED! Error: ", err);
        wx.showModal({
          title: "载入失败",
          content: "网络不稳定，请重新加载",
          showCancel: false
        });
      }
    });
  }
});
