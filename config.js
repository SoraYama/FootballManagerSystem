const host = 'www.sorayamah.org'
const config = {

  loadingToast: {
    title: '加载中...',
    mask: true
  },

  successToast: {
    title: '成功',
    icon: 'success',
    duration: 1500,
  },
  /** 主域名 */
  host,
  /** 创建比赛 */
  createGame: `https://${host}/createGame`,
  /** 用code换取openId */
  openIdUrl: `https://${host}/openid`,
  /** 获取所有比赛记录 */
  getAllGamesUrl: `https://${host}/all`,
  /** 用 id 查询比赛记录 */
  queryById: `https://${host}/gamebyid`,
  /** 报名 */
  enrol: `https://${host}/enrol`,
  /** 取消报名 */
  cancelEnrol: `https://${host}/cancelenrol`,
  /** 修改报名信息 */
  updateEnrol: `https://${host}/updateenrol`,
  /** 选派 */
  assign: `https://${host}/assign`,
  /** 删除比赛 */
  deleteGame: `https://${host}/deletegame`,

  /** 提交裁判员信息 */
  registReferee: `https://${host}/registinfo`,
  /** 转到裁判信息页面 */
  showReferee: `https://${host}/showreferee`,
  /** 根据裁判id查询信息 */
  queryRefereeById: `https://${host}/refereebyid`,
}

module.exports = config
