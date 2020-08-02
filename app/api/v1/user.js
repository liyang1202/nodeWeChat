const Router = require('koa-router')
const { RegisterValidator } = require('../../validator/validator')
const success = require('../../lib/helper')
const { User } = require('../../modules/user')
const router = new Router({
  prefix: '/v1/user', //注册URL路由的前缀
})

//注册  新增
router.post('/register', async (ctx) => {
  //接收参数，LinValidate校验
  //email  password  password  nickname
  const v = await new RegisterValidator().validate(ctx)
  //10是计算机生成盐的成本，成本越高，安全性更高，10是默认值
  //明文相同，加密之后也不容，防止彩虹攻击

  const user = {
    email: v.get('body.email'),
    password: v.get('body.password'),
    nickname: v.get('body.nickname'),
  }
  const r = User.create(user)
  success()
})

module.exports = router
