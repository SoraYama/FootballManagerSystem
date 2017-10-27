import config from '../../config.js'
const app = getApp()
const sliderWidth = 96

Page({
  data: {
    tabs: ["登记信息", "查看全部"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    heights: [],
    heightIndex: 0,

    refereeClass: "",
    refereeClasses: ["国家级","国家一级","国家二级","国家三级","其他"],
    refereeClassIndex: 0,

    weights: [],
    weightIndex: 0,
  },

  onLoad: function () {
    let that = this;
    let heights = [];
    for(let i = 0; i <= 50; i++) {
      heights.push(`${150 + i}cm`);
    }
    let weights = [];
    for (let i = 0; i <= 80; i++) {
      weights.push(`${40 + i}kg`);
    }
    this.setData({
      heights: heights,
      weights: weights,
    })
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