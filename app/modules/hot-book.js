const { sequelize } = require('../../core/db')
const { Model, Sequelize, Op } = require('sequelize')
const { Favor } = require('./favor')

class HotBook extends Model {
  static async getAll() {
    const books = await HotBook.findAll({
      order: ['index'],
    })

    const ids = []
    //不要在async和await中使用forEach,forEach不会等待异步执行结果返回
    books.forEach((book) => {
      ids.push(book.id)
    })

    const favors = await Favor.findAll({
      where: {
        art_id: {
          [Op.in]: ids,
        },
        type: 400,
      },
      group: ['art_id'], //分组的条件,可以根据多个条件分组，取交集
      attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']], //最后返回字段的名字，Sequelize.fn('COUNT')对所有记录总数，求总和是SUM
    })

    books.forEach((book) => {
      HotBook._getEachBookStatus(book, favors)
    })

    return books
  }

  static _getEachBookStatus(book, favors) {
    let count = 0

    favors.forEach((favor) => {
      if (book.id === favor.art_id) {
        count = favor.get('count')
      }
    })
    book.setDataValue('count', count)
    return book
  }
}
HotBook.init(
  {
    index: Sequelize.INTEGER,
    image: Sequelize.STRING,
    author: Sequelize.STRING,
    title: Sequelize.INTEGER,
  },
  {
    sequelize,
    tableName: 'hot_book',
  }
)

module.exports = { HotBook }
