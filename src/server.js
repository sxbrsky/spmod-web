module.exports = async () => {
    const { buildsRoutes } = require('./builds')
    const { HTTPServer } = require('http-server')
    const config = require('./config')

    const server = new HTTPServer({
        key: config.key,
        cert: config.cert
    }, config.webRoot)
    
    buildsRoutes.forEach(route => server.route(route.method, route.path, route.handler))

    server.listen(config.port)
}

