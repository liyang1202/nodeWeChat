const { Success } = require('../../core/http-exception')

function success(msg, errorCode) {
  throw new Success()
}

module.exports = { success }
