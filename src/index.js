const server = require('./server')

server()
    .then(() => console.log('Server started'))
    .catch(e => console.log(e))