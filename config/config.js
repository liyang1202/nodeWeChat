module.exports = {
  //dev开发环境
  //prod生产环境
  host: 'http://localhost:3000/',
  environment: 'dev',
  database: {
    dbName: 'koa',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
  },
  security: {
    secretKey: 'abcdefg', //令牌  应该是无规律的
    expiresIn: 60 * 60, //过期时间
  },
  wx: {
    appId: 'wxc0896f81e37d4c8c',
    appSecret: '2a25c0a8c05d1e79cba37488cd732cdf',
    loginUrl:
      'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',
  },
  yushu: {
    detailUrl: 'http://t.yushu.im/v2/book/id/%s',
    keywordUrl:
      'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s',
  },
}
