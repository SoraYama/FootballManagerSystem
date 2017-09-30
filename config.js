let host = "www.sorayamah.org"
let config = {
    host,
    // 用code换取openId
    openIdUrl: `https://${host}/openid`,
    // 获取所有比赛记录
    getAllGamesUrl: `https://${host}/all`,
    // 用 id 查询比赛记录
    queryById: `https://${host}/gamebyid`,
    // 报名
    enrol: `https://${host}/enrol`,
};

module.exports = config
