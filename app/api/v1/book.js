const Router = require('koa-router')
const {
  PositiveIntegerValidator,
  SearchValidator,
  AddShortCommentValidator,
} = require('../../validator/validator')
const { HotBook } = require('../../modules/hot-book')
const { Book } = require('../../modules/book')
const { Auth } = require('../../../middlewares/auth')
const { Favor } = require('../../modules/favor')
const { Comment } = require('../../modules/book-comment')
const { success } = require('../../lib/helper')

const router = new Router({
  prefix: '/v1/book',
})

router.get('/hot_list', async (ctx, next) => {
  const books = await HotBook.getAll()
  ctx.body = books
})

router.get('/:id/detail', async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = await Book.getDetail(v.get('path.id'))
  ctx.body = book
})

router.get('/search', async (ctx, next) => {
  const v = await new SearchValidator().validate(ctx)
  const detail = await Book.searchFromYuShu(
    v.get('query.q'),
    v.get('query.count'),
    v.get('query.start')
  )
  ctx.body = detail
})

router.get('/favor/count', new Auth().m, async (ctx, next) => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = count
})

router.get('/:book_id/favor', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'book_id',
  })
  const favor = await Favor.getBookFavor(v.get('path.book_id'), ctx.auth.uid)
  ctx.body = favor
})

router.post('/add/short_comment', new Auth().m, async (ctx, next) => {
  const v = await new AddShortCommentValidator().validate(ctx, {
    id: 'book_id',
  })
  await Comment.addComment(v.get('body.book_id'), v.get('body.content'))
  success()
})

router.get('/:book_id/short_comment', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'book_id',
  })
  const book_id = v.get('path.book_id')
  const comments = await Comment.getShortComment(book_id)
  ctx.body = {
    comments,
    book_id,
  }
})

module.exports = router
