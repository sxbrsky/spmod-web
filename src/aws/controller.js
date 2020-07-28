const https = require('https')
const { createWriteStream } = require('fs')
const config = require('../config')
const s3 = require('./aws')
const SnsValidator = require('sns-validator')

const reciveNotification = (req, res) => {
    const { body } = req;
    const validator = new SnsValidator()

    validator.validate(body, (err, message) => {
        if (err) {
            console.log(err, err.stack)
            return
        }

        if (message['Type'] === 'SubscriptionConfirmation') {
            https.get(message['SubscribeURL'], res => console.log(res))
        }

        if (message['Type'] === 'Notification') {
            const params = {
                Bucket: 'spmod',
                Key: message['Message']
            }
            const fileStream = createWriteStream(config.buildPath + params.Key)
            const s3Stream = s3.getObject(params).createReadStream().pipe(fileStream)

            s3Stream.on('error', err =>  res.status(500).json({ err, stack: err.stack }) )
            s3Stream.pipe(fileStream).on('error', err =>  res.status(500).json({ err, stack: err.stack }) )
        }

    })
}

module.exports = {
    reciveNotification
}