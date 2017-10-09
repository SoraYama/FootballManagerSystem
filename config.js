const host = 'www.sorayamah.org'
const config = {
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
}

module.exports = config
