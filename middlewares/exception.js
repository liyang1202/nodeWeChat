const { HttpException } = require('../core/http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    //生产环境且不是HttpException才抛出错误
    const isHttpException = error instanceof HttpException
    const isDev = global.config.environment === 'dev'
    if (isDev && !isHttpException) {
      throw error
    }
    if (isHttpException) {
      //已知异常
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`,
      }
      ctx.status = error.code
    } else {
      //未知异常
      ctx.body = {
        msg: 'we made a mistake 😭',
        error_code: 999,
        request: `${ctx.method} ${ctx.path}`,
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError
