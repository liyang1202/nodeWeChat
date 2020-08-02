const Koa = require('koa')
const InitManager = require('./core/init')
const bodyParser = require('koa-bodyparser')
const catchError = require('./middlewares/exception')
const static = require('koa-static')
const path = require('path')

const app = new Koa()

app.use(bodyParser())
app.use(catchError)
app.use(static(path.join(__dirname, './static')))

InitManager.initCore(app)

app.listen(3000, () => {
  console.log('监听3000端口')
})
