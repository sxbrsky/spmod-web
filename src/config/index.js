const path = require('path')
const { readFileSync } = require('fs')

const rootPath = path.resolve(__dirname, '..', '..')
const sslPath = path.join(rootPath, 'ssl')
const publicPath = path.join(rootPath, 'public')

module.exports = {
  publicPath: publicPath,
  buildPath: path.join(publicPath, 'builds'),
  key: readFileSync(path.join(sslPath, 'key.pem')),
  cert: readFileSync(path.join(sslPath, 'cert.pem'))
}
