const Router = require('koa-router')
const {
  TokenValidator,
  NotEmptyValidator,
} = require('../../validator/validator')
const { LoginType } = require('../../lib/enum')
const { User } = require('../../modules/user')
const { ParameterException } = require('../../../core/http-exception')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')
const { WXManager } = require('../../services/wx')
const router = new Router({
  prefix: '/v1/token',
})

router.post('/', async (ctx) => {
  const v = await new TokenValidator().validate(ctx)
  /**
   * 业务逻辑
   * 1、在API层
   * 2、Model中
   */

  /**
   * 业务分层
   * Model上层建立Service层
   * 中小级Model就可以了
   */
  let token
  switch (v.get('body.type')) {
    case LoginType.USER_EMAIL: //邮箱登录
      token = await emailLogin(v.get('body.account'), v.get('body.secret'))
      break
    case LoginType.USER_MINI_PROGRAM: //小程序登录
      token = await WXManager.codeToToken(v.get('body.account'))
      break
    default:
      throw new ParameterException('没有相应的处理函数')
  }
  ctx.body = token
})

router.post('/verify', async (ctx) => {
  const v = await new NotEmptyValidator().validate(ctx)
  const ret = Auth.verifyToken(v.get('body.token'))
  ctx.body = {
    is_valid: ret,
  }
})

//email登录
async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret)
  return (token = generateToken(user.id, Auth.USER))
}

module.exports = router
