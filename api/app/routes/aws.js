const {createWriteStream} = require('fs')
const https = require('https')
const aws = require('aws-sdk')
const sns = require('sns-validator')
const config = require('../../config')

aws.config.loadFromPath('./credentials.json')

const downloadFile = (key) => {
    return new Promise((resolve, reject) => {
        const s3 = new aws.S3({apiVersion: '2006-03-01'})
        const params = {Bucket: 'spmod', Key: key}
        const file = createWriteStream(`${config.buildPath}/${params.Key}`)
        const s3stream = s3.getObject(params).createReadStream()

        s3stream.on('error', reject)
        file.on('error', reject)
        file.on('close', () => resolve(`${config.buildPath}/${params.Key}`))
        s3stream.pipe(file)
    })
}

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

                        await downloadFile(key).catch(e => console.log(e))
                    }
                }
            })

            return h.response('ok').code(200)
        }
    }
]
