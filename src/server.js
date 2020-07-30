const HTTPServer = require('http-server')
const config = require('./config')

module.exports = async () => {
    const { buildsRoutes } = require('./builds')
    const { awsRoutes } = require('./aws')
    const { mainRoutes } = require('./main')

    const server = HTTPServer({
        https: {
            key: config.key,
            cert: config.cert,
            allowHTTP1: true
        },
        server: {
            rootPath: config.webRoot,
            staticPath: '/dist'
        }
    })
    
    buildsRoutes.forEach(route => server.route(route.method, route.path, route.handler))
    awsRoutes.forEach(route => server.route(route.method, route.path, route.handler))
    mainRoutes.forEach(route => server.route(route.method, route.path, route.handler))

    server.listen(config.port)
}

