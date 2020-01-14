import "./vendor/weapp-cookie/dist/weapp-cookie";
import network from "./lib/network";
import config from "./config";

App({
  onLaunch() {
    wx.login({
      success: res => {
        if (res.code) {
          network
            .request(
              config.login.url,
              {
                code: res.code
              },
              { method: config.login.method }
            )
            .then(({ data }) => {
              const { id, userInfo, isAdmin } = data;
              this.globalData.id = id;
              this.globalData.userInfo = userInfo;
              this.globalData.isAdmin = isAdmin;
            })
            .catch(err => {
              if (err.status && err.status === 1001) {
                return;
              }
            });
        }
      }
    });
  },

  globalData: {
    id: null,
    userInfo: null,
    isAdmin: false
  }
});
