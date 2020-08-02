const { sequelize } = require('../../core/db')
const { Model, Sequelize } = require('sequelize')

class Flow extends Model {}
Flow.init(
  {
    index: Sequelize.INTEGER, //期号
    art_id: Sequelize.INTEGER, //实体id号，去实体表中读取
    type: Sequelize.INTEGER, //代号
    // type:100  movie
    // type:200  music
    // type:300  sentence
  },
  {
    sequelize,
    tableName: 'flow',
  }
)

module.exports = { Flow }
