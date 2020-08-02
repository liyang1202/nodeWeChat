const { Sequelize, Model } = require('sequelize')
const { unset, clone, isArray } = require('lodash')
const {
  dbName,
  host,
  port,
  user,
  password,
} = require('../config/config').database
/**
 * 4个参数
 * 1、数据库名称
 * 2、用户名
 * 3、密码
 * 4、函数：可以传递多个参数
 */
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql', //数据类型
  host,
  port,
  logging: false, //显示具体的sql操作
  timezone: '+08:00', //时区，使用北京时间
  define: {
    timestamps: false,
    undescored: true, //将驼峰命名修改为_
    scopes: {
      bh: {
        //任意命名,查询结果排除'updated_at', 'deleted_at', 'created_at'
        attributes: {
          exclude: ['updated_at', 'deleted_at', 'created_at'],
        },
      },
    },
  },
})

sequelize.sync({
  // force: true, //删除原来的表，重新创建
})

Model.prototype.toJSON = function () {
  //所有的模型都不包括created_at等字段
  let data = clone(this.dataValues)
  // unset(data, 'created_at')
  // unset(data, 'updated_at')
  // unset(data, 'deleted_at')

  //不好：强制任务所有的image都是相对路径
  for (key in data) {
    if (key === 'image') {
      if (!data[key].startsWith('http')) {
        data[key] = global.config.host + data[key]
      }
    }
  }

  //在API中使用：**.exclude['a','b']排除a和b字段
  if (isArray(this.exclude)) {
    this.exclude.forEach((val) => {
      unset(data, val)
    })
  }
  return data
}

module.exports = { sequelize }
