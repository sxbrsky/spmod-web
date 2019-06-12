class Response
{
    constructor(headers)
    {
        this.headers = headers
        this.mime = headers['content-type'] || 'text/plain'
        this.code = headers[':status'] || 200
        this.body = 'OK'
    }

    status(code) {
        this.code = code

        return this
    }

    json(body) {
        this.body = body
        this.mime = 'application/json'

        return this
    }

    render(body) {
        this.body = body
        this.mime = 'text/html'

        return this
    }

    send(body) {
        this.body = body
        this.mime = 'text/plain'

        return this
    }
}

module.exports = (headers) => {
    return new Response(headers)
}