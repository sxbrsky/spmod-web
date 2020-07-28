const AwsController = require('./controller')

module.exports = [
    { method: 'POST', path: '/api/aws', handler: AwsController.reciveNotification }
]