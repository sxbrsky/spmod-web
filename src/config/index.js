const { readFileSync } = require('fs')
const { resolve } = require('path')

const rootPath = resolve(__dirname, '..', '..')
const sslPath = resolve(rootPath, 'ssl')
const htdocsPath = resolve(rootPath, 'htdocs')

module.exports = {
    path: {
        buildPath: resolve(htdocsPath, 'static', 'builds'),
        staticPath: htdocsPath
    },
    ssl: {
        key: readFileSync(resolve(sslPath, 'key.pem')),
        cert: readFileSync(resolve(sslPath, 'cert.pem'))
    },
    host: '0.0.0.0',
    port: 8443
}