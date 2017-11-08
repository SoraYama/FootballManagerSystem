import config from '../../config.js'
const app = getApp()
const sliderWidth = 96

Page({
  data: {

    showTopTips: false,

    tabs: ["登记信息", "查看全部"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    heights: [],
    heightIndex: 0,

    weights: [],
    weightIndex: 0,

    refereeClasses: ["国家级", "国家一级", "国家二级", "国家三级", "其他"],
    refereeClassIndex: 0,
    refereeScholarId: "",
    refereeName: "",
    refereeHeight: "",
    refereeWeight: "",
    refereeIdNumber: "",
    refereePhoneNumber: "",
    refereeBankNumber: "",
    refereeCardNumber: "",
    refereeClass: "",

  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  onLoad: function () {
    let that = this;
    let heights = [];
    for (let i = 0; i <= 50; i++) {
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

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });
  },

  bindRefereeName: function (e) {
    this.setData({
      refereeName: e.target.value,
    })
  },

  bindHeightChange: function (e) {
    this.setData({
      heightIndex: e.detail.value,
    })
  },

  bindWeightChange: function (e) {
    this.setData({
      weightIndex: e.detail.value,
    })
  },

  bindPhoneChange: function (e) {
    this.setData({
      refereePhoneNumber: e.target.value,
    })
  },

  bindIdChange: function (e) {
    this.setData({
      refereeIdNumber: e.target.value,
    })
  },

  bindCardChange: function (e) {
    this.setData({
      refereeCardNumber: e.target.value,
    })
  },

  bindBankChange: function (e) {
    this.setData({
      refereeBankNumber: e.target.value,
    })
  },

  bindClassChange: function (e) {
    console.log('*** class e: ', e)
    this.setData({
      refereeClassIndex: e.detail.value,
    })
  },

  formSubmit: function (e) {
    if (!this.data.refereeName || !this.data.refereePhoneNumber) {
      this.showTopTips()
      return
    }

    let formData = e.detail.value
    formData['openid'] = app.globalData.openid
    console.log("*** referee regist info: ", e.detail.value)
    wx.showLoading(config.loadingToast)
    wx.request({
      url: config.registReferee,
      data: formData,
      method: "POST",
      success: res => {
        wx.hideLoading()
        wx.showToast(config.successToast)
        console.log("referee regist success, res: ", res)
      },
      fail: err => {
        wx.hideLoading()
        console.error("referee regist failed, err: ", err)
      }
    })
  }
})
