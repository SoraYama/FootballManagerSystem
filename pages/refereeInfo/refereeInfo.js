import config from '../../config.js'
const app = getApp()
const sliderWidth = 96

Page({
  data: {
    tabs: ["登记信息", "查看全部"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    refereeClass: ["国家级","国家一级","国家二级","国家三级","其他"],
    refereeClassIndex: 0,
  },

  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
      }
    });
  },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });
  }
})