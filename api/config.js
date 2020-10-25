const { readFileSync } = require('fs')
const { resolve } = require('path')
const rootPath = resolve(__dirname, '..')

module.exports = {
    publicPath: `${rootPath}/public`,
    buildPath: `${rootPath}/public/builds`,
    ssl: {
        key: readFileSync('./ssl/key.pem'),
        cert: readFileSync('./ssl/cert.pem'),
        ca: [readFileSync('./ssl/ca.pem')],
        requestCert: true,
        rejectUnauthorized: true,
        allowHTTP1: true
    },
    host: '0.0.0.0',
    port: 443,
    routes: {
        cors: {
            origin: ['*'],
            headers: ['Authorization'],
            exposedHeaders: ['Accept'],
            additionalExposedHeaders: ['Accept'],
            maxAge: 60,
            credentials: true
        },
        files: {
            relativeTo: `${rootPath}/public`
        }
    }
}