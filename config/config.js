const path = require('path')
const fs = require('fs')

const env = function() {
  return process.env.NODE_ENV || 'development'
}

const readConfig = function() {
  const _env = env()
  const filepath = path.join(__dirname, `./${_env}.json`)
  try {
    return JSON.parse(fs.readFileSync(filepath).toString())
  } catch(e) {
    throw new Error(`Error reading config file : ${filepath}`)
  }
}

module.exports = {env, readConfig}
