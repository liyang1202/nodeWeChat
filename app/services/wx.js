/**
 * 微信的业务逻辑
 */

const util = require('util')
const { AuthFailed } = require('../../core/http-exception')
const { User } = require('../modules/user')
const { generateToken } = require('../../core/util')
const { Auth } = require('../../middlewares/auth')
const axios = require('axios')

class WXManager {
  /**
   * 小程序用户登录
   * 1、前端code码发送到服务端
   * 2、服务端调用微信提供的服务
   * 3、合法，微信返回服务端当前用户的openid
   */
  /**
   * 传参形式：
   * code：动态生成的，每次调用API登录时需要携带的
   * appid、appsecret固定的
   */
  static async codeToToken(code) {
    const url = util.format(
      global.config.wx.loginUrl,
      global.config.wx.appId,
      global.config.wx.appSecret,
      code
    )
    const ret = await axios.get(url)
    if (ret.status !== 200) {
      throw new AuthFailed('openid获取失败')
    }
    const errcode = ret.data.errcode
    const errmsg = ret.data.errmsg
    if (errcode !== 0 && errcode) {
      //code不合法
      throw new AuthFailed('openid获取失败:' + errmsg)
    }

    //创建用户档案，用户是否入库
    let user = await User.getUserByOpenid(ret.data.openid)
    if (!user) {
      user = User.registerByOpenId(ret.data.openid)
    }

    return generateToken(user.id, Auth.USER)
  }
}

module.exports = { WXManager }
