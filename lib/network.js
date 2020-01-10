import config from "../config";

class Network {
  constructor() {
    this.options = {
      method: "GET"
    };
  }

  setOptions(params = {}) {
    this.options = {
      ...this.options,
      params
    };
  }

  request = (url, data, options = {}) => {
    this.options = {
      ...this.options,
      ...options
    };
    const { method, header = {} } = this.options;
    return new Promise((resolve, reject) => {
      wx.showLoading(config.loadingToast);
      wx.request({
        url,
        method,
        header: {
          accept: "application/json",
          ...header
        },
        data,
        success: resp => {
          console.debug(`获取${url}的数据`, resp);
          const { data } = resp;
          if (data.status === 401) {
            wx.navigateTo({
              url: "/pages/login/login"
            });
            reject(data.errMsg);
            return;
          }
          if (data && data.status !== 0) {
            reject(data);
            return;
          }
          resolve(data);
        },
        fail: err => {
          console.debug("网络错误", err);
          wx.showModal({
            title: "操作失败",
            content: err.errMsg || "网络不稳定，请稍后再试",
            showCancel: false
          });
          reject(err);
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    });
  };
}

const network = new Network();

export default network;
