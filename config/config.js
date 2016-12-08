const path = require('path')

const env = () => {
  return process.env.NODE_ENV || 'development'
}

const testEnv = () => {
  return process.env.NODE_ENV || 'test'
}

module.exports = {env, testEnv}
