const BuildController = require('./controller')

module.exports = [
    { method: 'GET', path: '/api/builds', handler: BuildController.getBuilds },
    { method: 'GET', path: '/api/builds/:id', handler: BuildController.getBuild }
]