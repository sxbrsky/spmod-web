const BuildController = require('./controller')

module.exports = [
    { method: 'GET', path: '/builds', handler: BuildController.getBuilds },
    { method: 'GET', path: '/builds/:id', handler: BuildController.getBuild }
]