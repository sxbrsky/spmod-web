module.exports = async () => {
    const { buildsRoutes } = require('./builds')
    const { awsRoutes } = require('./aws')
    const { HTTPServer } = require('http-server')
    const config = require('./config')

    const server = new HTTPServer({
        key: config.key,
        cert: config.cert,
        allowHTTP1: true
    }, config.webRoot)
    
    buildsRoutes.forEach(route => server.route(route.method, route.path, route.handler))
    awsRoutes.forEach(route => server.route(route.method, route.path, route.handler))

    server.listen(config.port)
}

