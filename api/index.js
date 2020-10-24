const Application = require('./app')

Application().then(server => {
    console.log(`${server.info.uri}`)
}).catch (e => console.error(e))