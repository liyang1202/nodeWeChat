const { Sequelize, Model, Op } = require('sequelize')
const { sequelize } = require('../../core/db')
const {
  LikeError,
  DislikeError,
  NotFound,
} = require('../../core/http-exception')
const { Art } = require('./art')

class Favor extends Model {
  static async like(art_id, type, uid) {
    /**
     * 两次操作：
     * 1、往favo添加记录
     * 2、修改classic fav_num字段
     */

    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      },
    })
    if (favor) {
      //已点赞
      throw new LikeError()
    }
    /**
     * 数据库事物：一个失败，全部撤销，可以保证数据的一致性
     * 调用sequelize.transaction方法，传入一个回调函数
     * 每一个数据库操作需要传入一个transaction:t
     */

    return sequelize.transaction(async (t) => {
      await Favor.create(
        {
          art_id,
          type,
          uid,
        },
        { transaction: t }
      )

      const art = await Art.getData(art_id, type)
      /**
       * increment:+1
       * 第一个参数：修改的字段名
       * 第二个字段：修改的数量
       */
      await art.increment('fav_nums', { by: 1, transaction: t })
    })
  }

  static async dislike(art_id, type, uid) {
    const favor = Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      },
    })
    if (!favor) {
      throw new DislikeError()
    }
    return sequelize.transaction(async (t) => {
      //使用查询出来的favor
      await favor.destroy({
        /**
         * 控制物理删除还是软删除
         * true:物理删除，直接从数据库中删除
         * fale:软删除，在delete_at加入加入时间戳，标记被删除
         */
        force: false,
        transaction: t,
      })

      const art = await Art.getData(art_id, type)
      //decrement:-1
      await art.decrement('fav_nums', { by: 1, transaction: t })
    })
  }

  static async userLikeIt(art_id, type, uid) {
    const favor = Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      },
    })
    return favor ? true : false
  }

  static async getMyClassicFavors(uid) {
    // type!=400区分期刊和书籍
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          /**
           * [a]和'a'区别
           * [a]：a可以是表达式，可以进行运算
           */
          [Op.not]: 400, //type!=400,es5中所有的key都是字符串
        },
      },
    })
    if (arts.length === 0) {
      throw new NotFound()
    }

    //根据查询到的arts去实体表中获取详细信息
    /**
     * 循环查询数据库
     * 危害：循环查询数据库次数不可控
     * 使用SQL中的in查询：将id存入一个数组[ids]，将[ids]丢给sequelize
     */
    return await Art.getList(arts)
  }

  static async getBookFavor(bookId, uid) {
    const favorNums = await Favor.count({
      where: {
        art_id: bookId,
        uid,
        type: 400,
      },
    })

    //我是否喜欢
    const myFavor = await Favor.findOne({
      where: {
        art_id: bookId,
        uid,
        type: 400,
      },
    })
    return {
      fav_nums: favorNums,
      like_status: myFavor ? 1 : 0,
    }
  }
}

Favor.init(
  {
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
  },
  {
    sequelize,
    tableName: 'favor',
  }
)

module.exports = { Favor }
