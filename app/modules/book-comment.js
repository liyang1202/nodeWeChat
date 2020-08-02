const { Model, Sequelize } = require('sequelize')
const { sequelize } = require('../../core/db')

class Comment extends Model {
  static async addComment(bookID, content) {
    /**
     * 1、直接保存
     * 2、点赞
     * 3、评论相同，点赞+1
     */
    const comment = await Comment.findOne({
      where: {
        book_id: bookID,
        content,
      },
    })

    if (!comment) {
      //新增
      return await Comment.create({
        book_id: bookID,
        content,
        nums: 1,
      })
    } else {
      //近似相等，不新增评论，原评论+1
      return await comment.increment('nums', {
        by: 1,
      })
    }
  }

  static async getShortComment(bookID) {
    const comments = await Comment.findAll({
      where: {
        book_id: bookID,
      },
    })

    return comments
  }
}

Comment.init(
  {
    content: Sequelize.STRING(12),
    nums: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    book_id: Sequelize.INTEGER,
  },
  {
    sequelize,
    tableName: 'comment',
  }
)

module.exports = { Comment }
