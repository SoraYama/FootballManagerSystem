// const host = 'https://www.sorayamah.org'
const host = "http://localhost:7001";
const config = {
  loadingToast: {
    title: "加载中...",
    mask: true
  },

  successToast: {
    title: "成功",
    icon: "success",
    duration: 1500
  },

  failToast: {
    title: "失败",
    icon: "failed",
    duration: 1500
  },
  /** 主域名 */
  host,

  login: {
    url: `${host}/api/login`,
    method: "POST"
  },
  /** 创建比赛 */
  createGame: {
    url: `${host}/api/game`,
    method: "POST"
  },
  /** 获取所有比赛记录 */
  getAllGames: {
    url: `${host}/api/game`,
    method: "GET"
  },
  /** 用 id 查询比赛记录 */
  queryById: {
    url: `${host}/api/game`,
    method: "GET"
  },
  /** 报名 */
  enrol: {
    url: `${host}/api/game/enrol`,
    method: 'POST',
  },
  /** 取消报名 */
  cancelEnrol: {
    url: `${host}/api/game/enrol`,
    method: 'DELETE'
  },
  /** 修改报名信息 */
  updateEnrol: {
    url: `${host}/api/game/enrol`,
    method: 'PUT'
  },
  /** 选派 */
  assign: {
    url: `${host}/api/game/assign`,
    method: "PUT"
  },
  /** 删除比赛 */
  deleteGame: {
    url: `${host}/api/game`,
    method: "DELETE"
  },
  /** 提交裁判员信息 */
  registReferee: {
    url: `${host}/api/referee`,
    method: "POST"
  },
  /** 转到裁判信息页面 */
  showReferee: {
    url: `${host}/api/referee`,
    method: "GET"
  },
  /** 根据裁判id查询信息 */
  queryRefereeById: {
    url: `${host}/api/referee`,
    method: "GET"
  },
};

module.exports = config;
