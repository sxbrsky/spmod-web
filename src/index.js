const { HTTPServer } = require('http-server')
const fs = require('fs')
const path = require('path')

const baseRoot = path.join(__dirname + '/../public')

const server = new HTTPServer({
    key: fs.readFileSync('../ssl/key.pem'),
    cert: fs.readFileSync('../ssl/cert.pem'),
}, baseRoot)


server.listen(8080)
