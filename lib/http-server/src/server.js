const http = require('http2')
const fs = require('fs')
const path = require('path')
const mime = require('mime')

const Request = require('./request')
const Response = require('./response')

class HTTPServer {
    constructor(options, serverRoot = '/') {
        this.server = http.createSecureServer(options)
        this.serverRoot = serverRoot

        this.start()
    }

    listen (port) {
        this.server.listen(port)
    }


    start () {
        this.server.on('stream', (stream, headers) => this.handler(stream, headers))
    }

    handler (stream, headers) {
        const req = Request(headers)
        const res = Response(headers)

        const reqPath = req.path === '/' ? '/index.html' : req.path
        const files = this.getFiles(this.serverRoot)
        const file = files.get(`${this.serverRoot}${reqPath}`)
 
        if (!file) {
            stream.respond({ ':status': 404 })
            stream.end('404 - not found')
            return
        }

        if (req.path === '/index.html') {
            for (let file in files) {
                if (!file.endsWith('.html')) {
                    this.push(stream, reqPath, file)
                }
            }
        }
        stream.respondWithFD(file.fd, file.headers)
    }

    push(stream, path, file) {
        stream.pushStream({ ':path': path }, pushStream => {
            pushStream.respondWithFD(file.fd, file.headers)
        })
    }

    getFiles (baseDir, files = new Map()) {
        fs.readdirSync(baseDir).forEach(file => {
            let filePath = path.join(baseDir, file)
            let stat = fs.statSync(filePath)
            
            if (!stat.isDirectory()) {
                let fd = fs.openSync(filePath)
                let type = mime.getType(filePath)

                files.set(filePath, {
                    fd,
                    headers: {
                        'content-type': type,
                        'last-modified': stat.mtime.toUTCString(),
                        'content-size': stat.size 
                    }
                })
            } else {
                this.getFiles(filePath, files)
            }
        })

        return files
    }
}

module.exports = HTTPServer