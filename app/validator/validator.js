const { LinValidator, Rule } = require('../../core/lin-validator')
const { User } = require('../modules/user')
const { LoginType, ArtType } = require('../lib/enum')
const linValidator = require('../../core/lin-validator')

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    console.log(this.id)
    //多个rule之间的关系是&&
    this.id = [new Rule('isInt', '需要是正整数', { min: 1 })]
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super()

    //多个rule之间的关系是&&
    this.email = [new Rule('isEmail', '请输入格式正确的Email地址')]
    //用户密码指定范围  排除特殊字符
    this.password = [
      new Rule('isLength', '密码至少6个字符，最多32个字符', {
        min: 6,
        max: 32,
      }),
      new Rule(
        'matches',
        '密码不符合规范',
        '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]'
      ),
    ]
    this.repassword = this.password
    this.nickname = [
      new Rule('isLength', '昵称至少4个字符，最多32个字符', {
        min: 4,
        max: 32,
      }),
    ]
  }

  validatePassword(vals) {
    const pwd = vals.body.password
    const repwd = vals.body.repassword

    if (pwd !== repwd) {
      throw new Error('两个密码必须相等')
    }
  }

  async validateEmail(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      //findOne返回的是一个promise
      where: {
        //指定查询条件
        //数据库的字段：传入的字段
        email: email,
      },
    })
    if (user) {
      throw new Error('email已存在')
    }
  }
}

class TokenValidator extends LinValidator {
  constructor() {
    super()

    this.account = [
      new Rule('isLength', '不符合账号规则', {
        min: 4,
        max: 32,
      }),
    ]
    this.secret = [
      new Rule('isOptional'), //LinValidate自定义
      new Rule('isLength', '至少6个字符', {
        min: 6,
        max: 128,
      }),
    ]
  }

  validateLoginType(vals) {
    checkType(vals)
  }
}

class NotEmptyValidator extends LinValidator {
  constructor() {
    super()

    this.token = [new Rule('isLength', '不允许为空', { min: 1 })]
  }
}

function checkType(vals) {
  let type = vals.body.type || vals.path.type
  if (!type) {
    throw new Error('type是必填参数')
  }
  type = parseInt(type)
  if (!LoginType.isThisType(type)) {
    throw new Error('type参数不合法')
  }
}

class Checker {
  constructor(type) {
    this.enumType = type
  }

  check(vals) {
    let type = vals.body.type || vals.path.type
    if (!type) {
      throw new Error('type是必填参数')
    }
    type = parseInt(type)
    if (!this.enumType.isThisType(type)) {
      throw new Error('type参数不合法')
    }
  }
}

//对两个参数验证，PositiveIntegerValidator不需要再验证正整数
class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super()

    const checker = new Checker(ArtType)
    this.validateType = checker.check.bind(checker)
  }
}

class SearchValidator extends LinValidator {
  constructor() {
    super()

    this.q = [new Rule('isLength', '关键字不能为空', { min: 1, max: 16 })]
    this.start = [
      new Rule('isInt', 'start不符合规范', {
        min: 0,
        max: 60000,
      }),
      new Rule('isOptional', '', 0),
    ]
    this.count = [
      new Rule('isInt', '长度不符合规范', {
        min: 1,
        max: 20,
      }),
      new Rule('isOptional', '', 20),
    ]
  }
}

class AddShortCommentValidator extends LinValidator {
  constructor() {
    super()

    this.content = [
      new Rule('isLength', '必须在1-24个字符之间', {
        min: 1,
        max: 24,
      }),
    ]
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  Checker,
  SearchValidator,
  AddShortCommentValidator,
}
