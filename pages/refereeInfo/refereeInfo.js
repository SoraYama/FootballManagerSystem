import config from "../../config.js";
const app = getApp();
const sliderWidth = 96;

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

    isAdmin: null,
    myInfo: null,
    allRefereesInfo: [],

    goModify: false,
    queryData: ""
  },

  showTopTips: function() {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  onLoad: function() {
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
      heights,
      weights
    });
    wx.getSystemInfo({
      success: res => {
        that.setData({
          sliderLeft:
            (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset:
            (res.windowWidth / that.data.tabs.length) * that.data.activeIndex
        });
      }
    });

    this.getRefereeData();
  },

  getRefereeData: function() {
    wx.showLoading(config.loadingToast);

    const that = this;
    wx.request({
      ...config.showReferee,
      success: res => {
        console.log("*** show referee data: ", res.data);
        wx.hideLoading();
        let data = res.data;

        that.setData({
          isAdmin: data.isAdmin,
          myInfo: data.myInfo,
          allRefereesInfo: data.refereesInfo
        });

        if (!!data.myInfo) {
          that.setData({
            refereeName: data.myInfo.refereeName,
            refereeWeight: data.myInfo.refereeWeight,
            refereeHeight: data.myInfo.refereeHeight,
            refereePhoneNumber: data.myInfo.refereePhoneNumber,
            refereeIdNumber: data.myInfo.refereeIdNumber,
            refereeScholarId: data.myInfo.refereeScholarId,
            refereeCardNumber: data.myInfo.refereeCardNumber,
            refereeBankNumber: data.myInfo.refereeBankNumber,
            refereeClass: data.myInfo.refereeClass
          });
          app.globalData.myInfo = {
            refereeName: data.myInfo.refereeName,
            refereeWeight: data.myInfo.refereeWeight,
            refereeHeight: data.myInfo.refereeHeight,
            refereePhoneNumber: data.myInfo.refereePhoneNumber,
            refereeIdNumber: data.myInfo.refereeIdNumber,
            refereeScholarId: data.myInfo.refereeScholarId,
            refereeCardNumber: data.myInfo.refereeCardNumber,
            refereeBankNumber: data.myInfo.refereeBankNumber,
            refereeClass: data.myInfo.refereeClass
          };
        }
        wx.stopPullDownRefresh();
      }
    });
  },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  bindRefereeName: function(e) {
    this.setData({
      refereeName: e.detail.value
    });
  },

  bindHeightChange: function(e) {
    this.setData({
      heightIndex: e.detail.value,
      refereeHeight: this.data.heights[e.detail.value]
    });
  },

  bindWeightChange: function(e) {
    this.setData({
      weightIndex: e.detail.value,
      refereeWeight: this.data.weights[e.detail.value]
    });
  },

  bindPhoneChange: function(e) {
    this.setData({
      refereePhoneNumber: e.detail.value
    });
  },

  bindRefereeScholarId: function(e) {
    this.setData({
      refereeScholarId: e.detail.value
    });
  },

  bindIdChange: function(e) {
    this.setData({
      refereeIdNumber: e.detail.value
    });
  },

  bindCardChange: function(e) {
    this.setData({
      refereeCardNumber: e.detail.value
    });
  },

  bindBankChange: function(e) {
    this.setData({
      refereeBankNumber: e.detail.value
    });
  },

  bindClassChange: function(e) {
    console.log("*** class e: ", e);
    let that = this;
    this.setData({
      refereeClassIndex: e.detail.value,
      refereeClass: that.data.refereeClasses[e.detail.value]
    });
  },

  formSubmit: function(e) {
    let formData = e.detail.value;
    console.log("*** referee regist info: ", formData);
    console.log("*** this data ", this.data);
    if (!this.data.refereeName) {
      this.showTopTips();
      return;
    }

    const that = this;

    formData["openid"] = app.globalData.openid;

    wx.showLoading(config.loadingToast);
    wx.request({
      url: config.registReferee,
      data: formData,
      method: "POST",
      success: res => {
        wx.hideLoading();
        wx.showToast(config.successToast);
        console.log("referee regist success, res: ", res);
        that.getRefereeData();
      },
      fail: err => {
        wx.hideLoading();
        console.error("referee regist failed, err: ", err);
      }
    });
  },

  modifyInfo: function(e) {
    this.setData({
      goModify: true
    });
  },

  onPullDownRefresh: function() {
    this.getRefereeData();
  },

  /** 转发 */
  onShareAppMessage: function(res) {
    return {
      title: `信息注册`,
      path: `/pages/refereeInfo/refereeInfo`,
      success: function(res) {
        console.log("share success, res: ", res);
      }
    };
  }
});
