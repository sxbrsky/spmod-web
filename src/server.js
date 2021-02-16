const express = require('express')
const config = require('./config')

const server = async () => {
    const app = express()
    require('./store')

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })

    app.use(express.json())
    app.use('/static', express.static(config.path.staticPath))
    app.use('/build', express.static(config.path.buildPath))
    require('./router')(app)
    
    app.listen(config.port, () => {
        console.info('Server started')
    })

    process.on('SIGTERM', () => {
        app.close(() => {
            console.log('HTTP Server closed.')
        })
    })
}

server().catch(error => console.error(`${error.message}\n${error.stack}`))


