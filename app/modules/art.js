const { Op } = require('sequelize')
const { flatten } = require('lodash')
const { Movie, Music, Sentence } = require('./classic')

class Art {
  constructor(art_id, type) {
    this.art_id = art_id
    this.type = type
  }

  /**
   * get detail():通过Art.detail调用
   * getDetail:通过getDetail()调用
   */
  //Art.detail调用
  async getDetail(uid) {
    const { Favor } = require('./favor')
    const art = await Art.getData(this.art_id, this.type)
    if (!art) {
      throw new NotFound()
    }
    const like = await Favor.userLikeIt(this.art_id, this.type, uid)

    return {
      art,
      like_status: like,
    }
  }

  static async getList(artInfoList) {
    /**
     * 将artInfoList中的id[ids]
     * artInfoList中有三种类型的数据
     * artInfoObj中存入id号
     */
    const artInfoObj = {
      100: [],
      200: [],
      300: [],
    }

    for (let artInfo of artInfoList) {
      // artInfo.type artInfo.art_id
      artInfoObj[artInfo.type].push(artInfo.art_id)
    }
    const arts = []
    for (let key in artInfoObj) {
      const ids = artInfoObj[key]
      if (ids.length === 0) continue
      arts.push(await Art._getListByType(ids, parseInt(key)))
    }
    return flatten(arts)
  }

  static async _getListByType(ids, type) {
    let arts = null
    const finder = {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    }
    switch (type) {
      case 100:
        //根据scope查询，排除某些字段
        arts = await Movie.findAll(finder)
        break
      case 200:
        arts = await Music.findAll(finder)
        break
      case 300:
        arts = await Sentence.findAll(finder)
        break
      case 400:
        break

      default:
        break
    }
    return arts
  }

  static async getData(art_id, type) {
    //根据art_id,type去实体表中查询信息
    let art = null
    const finder = {
      where: {
        id: art_id,
      },
    }
    switch (type) {
      case 100:
        //根据scope查询，排除某些字段
        art = await Movie.scope('bh').findOne(finder)
        break
      case 200:
        art = await Music.findOne(finder)
        break
      case 300:
        art = await Sentence.findOne(finder)
        break
      case 400:
        const { Book } = require('./book')
        art = await Sentence.findOne(finder)
        if (!art) {
          art = await Book.create({
            id: art_id,
          })
        }
        break

      default:
        break
    }
    return art
  }
}

module.exports = { Art }
