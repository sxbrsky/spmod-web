const { parse } = require('url')

const getRequestBody = async (stream) => {
    const chunks = []
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
}

module.exports = async (stream, headers) => {
    const url = parse(headers[':path'])
    const body = await getRequestBody(stream)

    return {
        stream: stream,
        headers: headers,
        method: headers[':method'],
        protocol: headers[':scheme'],
        hostname: headers[':authority'],

        baseUrl: url.pathname,
        query: url.query,
        path: url.path,
        params: null,
        body: body || null

    }
}
