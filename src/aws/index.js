const { createWriteStream } = require('fs')
const https = require('https')
const AWS = require('aws-sdk')
const SNSValidator = require('sns-validator')
const config = require('../config')

module.exports = {
    init: app => {
        app.post('/api/aws', async (req, res) => {
            const { body } = req
            const validator = new SNSValidator()

            validator.validate(body, (error, msg) => {
                if (error) {
                    throw error
                }

                switch (msg.Type) {
                    case 'SubscriptionConfirmation': {
                        https.get(msg.SubscribeURL, res => console.log('Subscription Confirm'))
                        break
                    }

                    case 'Notification': {
                        const message = JSON.parse(msg.Message)
                        const key = message['Records'][0].s3.object.key
    
                        const chunks = []
                        const params = {Bucket: 'spmod', Key: key}
    
                        const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
                        const file = createWriteStream(`${config.path.buildPath}/${params.Key.split('/').pop()}`)
                        const stream = s3.getObject(params).createReadStream()
    
                        stream.on('readable', function()  {
                            let chunk
    
                            while (null !== (chunk = this.read()) ) {
                                chunks.push(chunk)
                            }
                        })
                        stream.on('end', () => file.end(Buffer.concat(chunks)));
                        file.on('end', () => console.log(`Build ${key} was saved with size: ${file.writableLength}`))
                    }    
                }
            })

            res.status(201).end()
        })
    }
}