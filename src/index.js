const server = require('./server')

server()
  .then(server => console.log(`Server started at: ${server.info.uri}`))
  .catch(e => console.log(e, e.stack))
