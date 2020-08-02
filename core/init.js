const requireDirectory = require('require-directory')
const Router = require('koa-router')

//初始化管理器
class InitManager {
  static initCore(app) {
    //入口方法
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.loadConfig()
  }

  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }

  static initLoadRouters() {
    //使用绝对值
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule,
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
}
module.exports = InitManager
