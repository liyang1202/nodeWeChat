const bcryptjs = require('bcryptjs')
const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
const { AuthFailed } = require('../../core/http-exception')

class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email,
      },
    })
    if (!user) {
      throw new AuthFailed('账号不存在')
    }
    //用户已存在，对比用户输入密码和数据困存储密码是否一致
    const correct = bcryptjs.compareSync(plainPassword, user.password)
    if (!correct) {
      throw new AuthFailed('密码不正确')
    }
    return user
  }

  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid,
      },
    })
    return user
  }

  static async registerByOpenId(openid) {
    return await User.create({
      openid,
    })
  }
}

User.init(
  {
    //主键：不能重复，不能为空
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, //加上之后id被认为是主键
      autoIncrement: true, //自动增长ID
    },
    nickname: Sequelize.STRING,
    email: {
      type: Sequelize.STRING(128),
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      set(val) {
        const salt = bcryptjs.genSaltSync(10)
        const pwd = bcryptjs.hashSync(val, salt)
        //setDataValue是Module中的方法
        this.setDataValue('password', pwd)
      },
    }, //不指定长度取默认值
    openid: {
      type: Sequelize.STRING(64), //最大长度64
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'user', //指定表名称
  }
)
module.exports = { User }
