const { parse } = require('url')

class Request
{
    constructor(headers) {
        const url = parse(headers[':path'])

        this.headers = headers
        this.method = headers[':method']
        this.protocol = headers[':scheme']
        this.hostname = headers[':authority']
        this.baseUrl = url.pathname
        this.query = url.query
        this.path = url.path
        this.body = null
    }
}

module.exports = (headers) => {
    return new Request(headers)
}
