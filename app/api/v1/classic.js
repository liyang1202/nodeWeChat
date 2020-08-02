const Router = require('koa-router')
const {
  PositiveIntegerValidator,
  LikeValidator,
} = require('../../validator/validator')
const { Auth } = require('../../../middlewares/auth')
const { Flow } = require('../../modules/flow')
const { Art } = require('../../modules/art')
const { Favor } = require('../../modules/favor')
const { NotFound } = require('../../../core/http-exception')
const router = new Router({
  prefix: '/v1/classic',
})

//new Auth().m报错时，可以阻止请求继续执行
router.get('/latest', new Auth().m, async (ctx, next) => {
  const flow = await Flow.findOne({
    order: [
      [
        'index', //按index排序
        'DESC', //正序还是倒序
      ],
    ],
  })
  const art = await Art.getData(flow.art_id, flow.type)
  const likeLatest = await Favor.userLikeIt(flow.art_id, flow.type)
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeLatest)
  ctx.body = art
})

router.get('/:index/next', new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index',
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index: index + 1,
    },
  })
  if (!flow) {
    throw new NotFound()
  }
  const art = await Art.getData(flow.art_id, flow.type)
  const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)

  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeNext)
  ctx.body = art
})

router.get('/:index/prev', new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index',
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index: index - 1,
    },
  })
  if (!flow) {
    throw new NotFound()
  }
  const art = await Art.getData(flow.art_id, flow.type)
  const likePrev = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likePrev)
  ctx.body = art
})

router.get('/:type/:id/favor', new Auth().m, async (ctx) => {
  const v = await new LikeValidator().validate(ctx)
  const type = parseInt(v.get('path.type'))
  const id = v.get('path.id')

  const art = await Art.getData(id, type)
  if (!art) {
    throw new NotFound()
  }
  const like = await Favor.userLikeIt(id, type, ctx.auth.uid)
  art.setDataValue.like_status = like
  ctx.body = art
})

router.get('/:type/:id', new Auth().m, async (ctx) => {
  const v = await new LikeValidator().validate(ctx)
  const type = parseInt(v.get('path.type'))
  const id = v.get('path.id')

  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
  artDetail.art.setDataValue.like_status = artDetail.like_status
  ctx.body = artDetail.art
})

router.get('/favor', new Auth().m, async (ctx) => {
  const uid = ctx.auth.uid
  const favors = await Favor.getMyClassicFavors(uid)

  if (!favors) {
    throw new NotFound()
  }
  ctx.body = favors
})
module.exports = router
