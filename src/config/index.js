const { resolve, join } = require('path')
const { readFileSync } = require('fs')

const rootPath = resolve(__dirname, '../../')
const sslPath = join(rootPath, 'ssl')
const webRoot = join(rootPath, 'public')
const buildPath = join(webRoot, 'builds')

module.exports = {
    webRoot,
    buildPath,
    key: readFileSync(join(sslPath, 'key.pem')),
    cert: readFileSync(join(sslPath, 'cert.pem'))
}