const SnsValidator = require('sns-validator')
const https = require('https')
const Aws = require('aws-sdk')
const { createWriteStream } = require('fs')
const config = require('../config')

const s3 = new Aws.S3()

module.exports = [
  {
    method: 'POST',
    path: '/api/aws',
    handler: async (req, h) => {
      const body = req.payload
      const validator = new SnsValidator()

      validator.validate(body, (e, msg) => {
        if (e) {
          console.log(e, e.stack)
          return
        }

        switch (msg.Type) {
          case 'SubscriptionConfirmation': {
            https.get(msg.SubscribeURL, res => console.log(res))
            break
          }

          case 'Notification': {
            const params = {
              Bucket: 'spmod',
              Key: msg.Message
            }
            const fileStream = createWriteStream(config.buildPath + params.Key)
            const s3Stream = s3.getObject(params).createReadStream().pipe(fileStream)

            s3Stream.on('error', e => h.response(e, e.stack).code(500))
            s3Stream.pipe(fileStream).on('error', e => h.response(e, e.stack).code(500))
          }
        }
      })
    }
  }
]
