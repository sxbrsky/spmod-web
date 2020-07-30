const MainController = require('./controller')

module.exports = [
    { method: 'GET', path: '/', handler: MainController.index },
]