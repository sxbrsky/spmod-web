const {createWriteStream} = require('fs')
const https = require('https')
const aws = require('aws-sdk')
const sns = require('sns-validator')
const config = require('../../config')

aws.config.loadFromPath('./credentials.json')

module.exports = [
    {
        method: 'POST',
        path: '/api/aws',
        handler: async (req, h) => {
            const body = req.payload
            const validator = new sns()

            validator.validate(body, async (e, msg) => {
                if (e) {
                    console.log(e.stack)
                    return
                }

                switch (msg.Type) {
                    case 'SubscriptionConfirmation': {
                        https.get(msg.SubscribeURL, res => console.log('Subscription Confirm'))
                        break
                    }

                    case 'Notification': {
                        const message = JSON.parse(msg.Message)
                        const key = message['Records'][0].s3.object.key

                        const params = {Bucket: 'spmod', Key: key}
                        const chunks = []

                        const s3 = new aws.S3({apiVersion: '2006-03-01'})
                        const file = createWriteStream(`${config.buildPath}/${params.Key}`)
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

            return h.response('ok').code(200)
        }
    }
]