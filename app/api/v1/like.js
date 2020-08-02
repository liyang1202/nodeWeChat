const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { LikeValidator } = require('../../validator/validator')
const { success } = require('../../lib/helper')
const { Favor } = require('../../modules/favor')
const router = new Router({
  prefix: '/v1/like',
})

router.post('/', new Auth().m, async (ctx) => {
  const v = await new LikeValidator().validate(ctx, {
    id: 'art_id', //别名，检测art_Id
  })
  await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
  success()
})

router.post('/cancel', new Auth().m, async (ctx) => {
  const v = await new LikeValidator().validate(ctx, {
    id: 'art_id', //别名，检测art_Id
  })
  await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
  success()
})

module.exports = router
