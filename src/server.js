const hapi = require('@hapi/hapi')
const http2 = require('http2')
const config = require('./config')
const Routes = require('./routes')

module.exports = async () => {
  const server = hapi.Server({
    tls: true,
    port: process.env.PORT || 8080,
    listener: http2.createSecureServer({
      key: config.key,
      cert: config.cert
    }),
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
        relativeTo: config.publicPath
      }
    }
  })

  await server.register(require('@hapi/inert'))

  for (const i in Routes) {
    server.route(Routes[i])
  }

  try {
    await server.start()
  } catch (e) {
    console.log(e, e.stack)
    process.exit(1)
  }

  return server
}
