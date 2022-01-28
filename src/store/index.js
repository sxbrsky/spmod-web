const store = require('./store')

module.exports = {
    init: store.init,
    find: store.find,
    findOne: store.findOne
}