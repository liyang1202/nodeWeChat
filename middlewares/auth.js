const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { Forbidden } = require('../core/http-exception')

class Auth {
  constructor(level) {
    this.level = level
    Auth.USER = 8
    Auth.ADMIN = 16
  }
  get m() {
    return async (ctx, next) => {
      //token检测
      //合法  执行
      //不合法  中断
      //token可以放在body、header中
      //HTTP规定身份验证机制 HTTPBasicAuth
      // 服务器解析token使用basic-auth

      // ctx.req获取的是node.js的request
      const userToken = basicAuth(ctx.req)
      let errMsg = 'token不合法'
      if (!userToken || !userToken.name) {
        //不合法  终止访问
        throw new Forbidden(errMsg)
      }
      try {
        //验证
        var decode = jwt.verify(
          userToken.name,
          global.config.security.secretKey
        )
      } catch (error) {
        //提示用户不合法
        if (error.name == 'TokenExpiresdError') {
          //token合法,但已过期
          errMsg = 'token已过期'
        }
        throw new Forbidden(errMsg)
      }

      if (decode.scope < this.level) {
        errMsg = '权限不足'
        throw new Forbidden(errMsg)
      }

      //从token中获取uid和scope
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      }

      await next()
    }
  }

  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = { Auth }
