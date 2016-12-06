const path = require('path')

const env => {
  return process.env.NODE_ENV || 'development'
}

module.exports = {env}
