const util = require('util')
const { Model, Sequelize } = require('sequelize')
const { sequelize } = require('../../core/db')
const axios = require('axios')
const { Favor } = require('./favor')

class Book extends Model {
  // constructor(id) {
  //   super()
  //   this.id = id
  // }

  static async getDetail(id) {
    const url = util.format(global.config.yushu.detailUrl, id)
    const detail = await axios.get(url)
    return detail.data
  }

  static async searchFromYuShu(q, count, start, summary = 1) {
    const url = util.format(
      global.config.yushu.keywordUrl,
      encodeURI(q),
      count,
      start,
      summary
    )
    const detail = await axios.get(url)
    return detail.data
  }

  static async getMyFavorBookCount(uid) {
    const count = await Favor.count({
      where: {
        type: 400,
        uid,
      },
    })
    return count
  }
}

Book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    fav_nums: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'book',
  }
)

module.exports = { Book }
