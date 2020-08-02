/**
 * classic（music sentence movie）
 * 共有字段：
 * image：图片
 * title：标题
 * pubdate：发布日期
 * content：内容
 * fav_nums：点赞数
 * type：代号（100m 200s 300m）
 *
 * music：
 * url：播放链接
 */
const { sequelize } = require('../../core/db')
const { Model, Sequelize } = require('sequelize')

const classicFileds = {
  image: {
    type: Sequelize.STRING,
    get() {
      return global.config.host + this.getDataValue('image')
    },
  },
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
    type: Sequelize.INTEGER,
    default: 0,
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
}

class Movie extends Model {}
Movie.init(classicFileds, {
  sequelize,
  tableName: 'movie',
})

class Music extends Model {}
Music.init(classicFileds, {
  sequelize,
  tableName: 'music',
})

class Sentence extends Model {}
Sentence.init(
  Object.assign(
    {
      url: Sequelize.STRING,
    },
    classicFileds
  ),
  {
    sequelize,
    tableName: 'sentence',
  }
)

module.exports = { Movie, Music, Sentence }
